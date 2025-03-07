# HandsOn - Volunteer Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Project Overview
A GitHub-like platform for social volunteering that connects individuals with meaningful community impact opportunities through organized events and team initiatives.

## 🛠 Tech Stack
**Frontend**:
- React
- Tailwind CSS 3
- Axios

**Backend**:
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT Authentication

## 🚀 Key Features
- User registration & profile management
- Event discovery with advanced filters
- One-click event registration
- Volunteer hour tracking
- Team collaboration spaces
- Achievement badges & leaderboards

## Backend Setup:
cd backend
npm install

## Frontend Setup
cd frontend
npm install

## Start Development Servers
#Backend (from server directory):
npm run dev

#Frontend (from client directory):
npm run dev

# API Authentication Documentation

API Endpoints
🆕 User Registration
POST /api/auth/register

Content-Type: application/json

{
  "name": "Jamil Smith",
  "email": "jamil@email.com",
  "password": "SecurePass123!",
  "passwordConfirmation": "SecurePass123!"
}
Success Response (201):

{
  "user": {
    "id": "65f8a1b2c1e6a4c1e6a4c1e6",
    "name": "Jamil Smith",
    "email": "jamil@email.com"
  }
}
🔑 User Login
POST /api/auth/login

Content-Type: application/json

{
  "email": "jamil@email.com",
  "password": "SecurePass123!"
}
Success Response (200):

{
  "success": true,
  "user": {
    "id": "65f8a1b2c1e6a4c1e6a4c1e6",
    "name": "Jamil Smith",
    "email": "jamil@email.com",
    "skills": ["Teaching", "First Aid"],
    "causes": ["Education", "Poverty"]
  }
}
👤 Get User Profile
GET /api/auth/profile

Authorization: Bearer <JWT_TOKEN>
Response Includes:

User details (excluding password)

Volunteer history with event metadata

Skills and causes arrays

✏️ Update Profile
PUT /api/auth/profile

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Name",
  "skills": ["New Skill", "First Aid"],
  "causes": ["Environment", "Education"]
}
Validation Rules:

Skills: 1-10 unique items

Causes: 1-5 unique items

Security
🛡️ Password requirements:

Minimum 8 characters

1 uppercase letter

1 number

1 special character

🔄 Automatic session invalidation after 1 hour

🍪 Secure cookie settings:

js
Copy
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}
Error Handling
Code	Scenario	Response Example
400	Validation error	{"errors": [{"msg": "Invalid email"}]}
401	Invalid credentials	{"message": "Invalid credentials"}
409	Duplicate email	{"message": "Email already exists"}
429	Rate limit exceeded	{"message": "Too many attempts"}
500	Server error	{"message": "Internal server error"}

