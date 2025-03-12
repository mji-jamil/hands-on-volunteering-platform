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

## API Endpoints

### 🆕 User Registration
**`POST /api/auth/register`**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jamil Smith",
  "email": "jamil@email.com",
  "password": "SecurePass123!",
}
```

**✅ Success Response (201 Created)**  
```json
{
  "user": {
    "id": "65f8a1b2c1e6a4c1e6a4c1e6",
    "name": "Jamil Smith",
    "email": "jamil@email.com"
  }
}
```
### 🔑 User Login
**`POST /api/auth/login`**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jamil@email.com",
  "password": "SecurePass123!"
}
```
✅ Success Response (200 OK)
```
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
```
👤 Get User Profile
GET /api/auth/profile

✏️ Update Profile
PUT /api/auth/profile
```
PUT /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Name",
  "skills": ["New Skill", "First Aid"],
  "causes": ["Environment", "Education"]
}
```
## Error Handling Reference

| Code | Scenario                      | Example Response                          |
|------|-------------------------------|-------------------------------------------|
| 🔒 401  | **Invalid Credentials**       | `{"message": "Invalid credentials"}`      |
| 💥 409  | **Duplicate Email**           | `{"message": "User already exists"}`     |
| ⏳ 429  | **Rate Limit Exceeded**       | `{"message": "Too many attempts"}`        |
| 🖥️ 500  | **Internal Server Error**     | `{"message": "Internal server error"}`    |