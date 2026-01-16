from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserProfile
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
        # Assuming MongoDB is running locally, adjust as needed
        client = MongoClient('mongodb://localhost:27017/')
        return client['llm_chat_db']

    def post(self, request):
        message = request.data.get('message')
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Here, integrate with your LLM model
        # For now, just echo the message
        response = f"Echo: {message}"

        # Save to MongoDB
        db = self.get_mongo_client()
        chat_collection = db['chats']
        chat_collection.insert_one({
            'user_id': request.user.id,
            'message': message,
            'response': response,
            'timestamp': request.timestamp
        })

        return Response({'response': response})
