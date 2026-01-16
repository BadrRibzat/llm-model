from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserProfile, Chat
from .ai_service import ai_service
from pymongo import MongoClient
import os

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.userprofile

class ChatView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get_mongo_client(self):
        # Connect to MongoDB Atlas using environment variables
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        db_name = os.getenv('DATABASE_NAME', 'llm_chat_db')
        client = MongoClient(mongo_uri)
        return client[db_name]

    def post(self, request):
        message = request.data.get('message', '')
        uploaded_files = []

        # Handle file uploads
        for key, value in request.FILES.items():
            if key.startswith('file_'):
                uploaded_files.append({
                    'name': value.name,
                    'type': value.content_type,
                    'size': value.size,
                    'file': value
                })

        # Process uploaded files and extract content if needed
        file_contents = []
        for uploaded_file in uploaded_files:
            try:
                # Read file content for text-based files
                if uploaded_file['type'] in ['text/plain', 'application/json', 'text/markdown']:
                    content = uploaded_file['file'].read().decode('utf-8')
                    file_contents.append(f"Content of {uploaded_file['name']}:\n{content}")
                elif uploaded_file['type'] == 'application/pdf':
                    # For PDF files, we could extract text using PyPDF2
                    file_contents.append(f"PDF file uploaded: {uploaded_file['name']} ({uploaded_file['size']} bytes)")
                else:
                    file_contents.append(f"File uploaded: {uploaded_file['name']} ({uploaded_file['type']}, {uploaded_file['size']} bytes)")
            except Exception as e:
                file_contents.append(f"Error reading {uploaded_file['name']}: {str(e)}")

        # Combine message with file contents
        full_message = message
        if file_contents:
            full_message += "\n\nAttached files:\n" + "\n".join(file_contents)

        # Generate AI response using the trained model
        response = ai_service.generate_response(full_message)

        # Parse response for artifacts (code blocks, etc.)
        artifacts = ai_service.parse_artifacts(response)

        # Save to Django database for admin interface
        chat_obj = Chat.objects.create(
            user=request.user,
            message=full_message,
            response=response
        )

        # Save to MongoDB with file information
        attachments = [{
            'name': f['name'],
            'type': f['type'],
            'size': f['size']
        } for f in uploaded_files]

        db = self.get_mongo_client()
        chat_collection = db['chats']
        chat_collection.insert_one({
            'user_id': request.user.id,
            'message': full_message,
            'response': response,
            'artifacts': artifacts,
            'attachments': attachments,
            'timestamp': chat_obj.timestamp,
            'django_id': chat_obj.id
        })

        return Response({
            'response': response,
            'artifacts': artifacts,
            'attachments': attachments
        })
