MERN Blog - Full Stack Blog Application
A modern, full-featured blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application demonstrates seamless integration between front-end and back-end components with complete CRUD functionality, user authentication, and advanced features.

Features
Core Features
User Authentication - Register, login, and logout functionality with JWT

Blog Post Management - Create, read, update, and delete blog posts

Categories - Organize posts with categories

Comments System - Add comments to blog posts

Responsive Design - Mobile-friendly UI

Advanced Features
Image Uploads - Support for featured images in posts

Search & Filter - Search posts by title/content and filter by categories

Pagination - Efficient post browsing with pagination

User Authorization - Role-based access control (user/admin)

View Counts - Track post popularity

Tech Stack
Frontend
React 18 - Modern React with hooks

React Router DOM - Client-side routing

Axios - HTTP client for API calls

Context API - State management

Vite - Fast build tool and dev server

Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

JWT - JSON Web Tokens for authentication

bcryptjs - Password hashing

Cloudinary - Image upload and management

Helmet - Security middleware

Express Rate Limit - Rate limiting middleware

Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v18 or higher)

MongoDB (local installation or MongoDB Atlas account)

npm or yarn package manager

Installation & Setup
1. Clone the Repository
bash
git clone <https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-emmumbua.githttps://github.com/PLP-MERN-Stack-Development/mern-stack-integration-emmumbua.git>
cd mern-blog
2. Backend Setup
bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
Edit the .env file with your configuration:

env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
3. Frontend Setup
bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
Edit the .env file:

env
VITE_API_BASE_URL=http://localhost:5000/api
4. Database Setup
Make sure MongoDB is running on your system:

bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
Running the Application
Development Mode
Start the Backend Server:

bash
cd server
npm run dev
Server will run on http://localhost:5000

Start the Frontend Development Server:

bash
cd client
npm run dev
Client will run on http://localhost:3000

Production Build
bash
# Build the client
cd client
npm run build

# Start production server (backend)
cd ../server
npm start
Project Structure
text
mern-blog/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout/    # Layout components
│   │   │   ├── Post/      # Post-related components
│   │   │   └── Auth/      # Authentication components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── context/       # React context providers
│   │   └── App.jsx        # Main application component
│   └── package.json
├── server/                # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user

Posts
GET /api/posts - Get all posts (with pagination, search, filter)

GET /api/posts/:id - Get single post

POST /api/posts - Create new post (protected)

PUT /api/posts/:id - Update post (protected)

DELETE /api/posts/:id - Delete post (protected)

GET /api/posts/:id/comments - Get post comments

Categories
GET /api/categories - Get all categories

POST /api/categories - Create category (protected/admin)

PUT /api/categories/:id - Update category (protected/admin)

DELETE /api/categories/:id - Delete category (protected/admin)

Comments
POST /api/comments - Create comment (protected)

DELETE /api/comments/:id - Delete comment (protected)

Database Models
User
name, email, password, avatar, role

Post
title, content, excerpt, featuredImage, author, categories, tags, isPublished, slug, viewCount

Category
name, description, color

Comment
content, author, post, parentComment, isApproved

Authentication & Authorization
JWT-based authentication

Protected routes for post creation, editing, and deletion

Role-based access control (user/admin)

Password hashing with bcryptjs

UI/UX Features
Responsive design that works on all devices

Clean, modern interface with intuitive navigation

Loading states and error handling

Optimistic UI updates for better user experience

Form validation on both client and server side

Deployment
Backend Deployment (Heroku/Railway)
Set environment variables in your hosting platform

Deploy the server directory

Ensure MongoDB connection string is properly set

Frontend Deployment (Netlify/Vercel)
Build the client: npm run build

Deploy the dist folder

Set environment variables for API base URL

Environment Variables for Production
env
# Backend
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_*=# your_cloudinary_credentials

# Frontend
VITE_API_BASE_URL=your_deployed_backend_url/api
Testing the Application
Register a new user at /register

Login with your credentials at /login

Create a post at /create-post

Browse posts at /posts

View post details and add comments

Edit/Delete your own posts

Available Scripts
Server Scripts
bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
Client Scripts
bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

Configuration
MongoDB Connection
Local: mongodb://localhost:27017/mern-blog

Atlas: mongodb+srv://username:password@cluster.mongodb.net/mern-blog

JWT Configuration
Token expiration: 30 days

Secret key should be strong and unique

Cloudinary Setup
Create a Cloudinary account

Get your cloud name, API key, and API secret

Add them to your environment variables

Contributing
Fork the repository

Create a feature branch: git checkout -b feature/new-feature

Commit your changes: git commit -m 'Add new feature'

Push to the branch: git push origin feature/new-feature

Submit a pull request

License
This project is licensed under the MIT License.

Author

Eunitah Mumbua
