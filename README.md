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

📚 API Documentation
Authentication
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login

Example Request:
POST /api/auth/login
Content-Type: application/json

{
  "email": "jamil@email.com",
  "password": "Jamil123?"
}

Success Response:
{
  "user": {
    "id": "65f8a1b2c1e6a4c1e6a4c1e6",
    "name": "Jamil",
    "email": "jamil@email.com"
  }
}
