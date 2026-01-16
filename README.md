# AI Chat Model Application

This is a full-stack application for chatting with AI Chat Model, a Large Language Model trained across 12 domains and 74 niches for high-quality content generation and conversational AI.

## Features

- **Professional Landing Page**: Showcases the AI's capabilities and training background
- **User Authentication**: Secure JWT-based registration and login
- **Real-time Chat Interface**: Clean, modern chat UI with your trained LLM
- **User Profiles**: Profile management for authenticated users
- **Support Page**: Dedicated page for project donations and support
- **Comprehensive Footer**: Developer information, licensing, and support links
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **MongoDB Atlas Ready**: Prepared for cloud database integration

## Model Information

**AI Chat Model** is trained on:
- **12 Major Domains**: Technology, Business, Health, Education, Arts, Science, and more
- **74 Specialized Niches**: Covering diverse topics with high-quality content generation
- **Multi-purpose Use**: Originally for content generation, adapted for intelligent chatbot conversations

## Project Structure

```
llm-model/
├── backend/          # Django REST API
│   ├── llm_project/  # Django project settings
│   ├── chat/         # Chat app with authentication
│   └── manage.py
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/      # Next.js app router pages
│   │   └── components/
│   └── package.json
├── LICENSE
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- MongoDB Atlas account (for production database)
- Your AI Chat Model (located at `/home/badr/Downloads/bookgen_final_model.zip`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. The virtual environment is already set up. Activate it:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies (already done):
   - Django
   - Django REST Framework
   - PyMongo
   - Django CORS Headers
   - Django REST Framework Simple JWT
   - Pillow

4. Set up MongoDB Atlas (see Database Setup section below)

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at http://localhost:8000/api/

### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster with network access set to `0.0.0.0/0` (allow from anywhere)
3. Get your connection string from Atlas
4. Update the backend MongoDB connection in `backend/chat/views.py`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## API Endpoints

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/token/refresh/` - Refresh JWT token
- `GET /api/profile/` - Get user profile
- `POST /api/chat/` - Send message to LLM

## Integrating Your AI Chat Model

1. Extract your model from `/home/badr/Downloads/bookgen_final_model.zip`
2. Place model files in the `backend/` directory
3. Install required ML libraries:
   ```bash
   pip install transformers torch
   ```
4. Update `backend/chat/views.py` to load and use your model instead of the echo response
5. Modify the response generation logic for actual AI conversations

## UI Features

- **Landing Page**: Professional presentation of AI capabilities
- **Authentication Forms**: Modern, accessible sign-in and registration
- **Chat Interface**: Clean, WhatsApp-style conversation UI
- **Support Page**: Dedicated donation and support page with Ko-fi and PayPal links
- **Comprehensive Footer**: Developer contact info, licensing, and support links
- **Responsive Design**: Works perfectly on desktop and mobile
- **Loading States**: Smooth user experience with loading indicators

## Usage

1. Visit the landing page to learn about AI Chat Model
2. Register a new account or sign in
3. Access your profile and start chatting with the AI
4. Messages and conversations are stored for future reference

## About the Developer

**Badr Ribzat** - Full-Stack Developer & AI Enthusiast

- **GitHub**: [github.com/BadrRibzat](https://github.com/BadrRibzat)
- **LinkedIn**: [linkedin.com/in/badr-ribzat14121990](https://www.linkedin.com/in/badr-ribzat14121990/)
- **Vanhack**: [vanhack.com/vanhacker/afe29276-5038-44c1-920e-12a09c2c9b0c](https://vanhack.com/vanhacker/afe29276-5038-44c1-920e-12a09c2c9b0c)
- **Portfolio**: [badr-portfolio.vercel.app](https://badr-portfolio.vercel.app)
- **Email**: badrribzat@gmail.com
- **Phone**: +212627764176

## Support the Project

Help keep AI Chat Model free and open source! Support development through:

- **Ko-fi**: [ko-fi.com/badrribzat](https://ko-fi.com/badrribzat)
- **PayPal**: [paypal.me/BadrRibzat1990](https://paypal.me/BadrRibzat1990)

Visit the [Support Page](/support) to learn more about contributing to the project.

## License

This project is licensed under the GNU General Public License Version 3 (GPLv3), 29 June 2007.
See the [LICENSE](LICENSE) file for the full license text.

## Next Steps

1. Set up MongoDB Atlas for production database
2. Integrate your AI Chat Model for actual AI responses
3. Implement conversation history persistence
4. Add user avatar upload functionality
5. Deploy to production environment