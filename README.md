# Project Management App API

A secure and modular backend API for the Project Management application, built with Node.js, Express, and MongoDB using Mongoose. Provides user authentication, project management, and task management with ownership-based access control.

## 🧱 Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- CORS

## 📂 Project Structure

```
/config
  connection.js

/models
  Project.js
  Task.js
  User.js

/routes
  projects.js
  tasks.js
  users.js

/utils
  auth.js

node_modules/
.env
server.js
```

## 🔐 Authentication

All sensitive routes require a valid JWT passed in the `Authorization` header:

Authorization: Bearer <token>

Passwords are hashed using `bcrypt`. Only the owner of a project or task can access or modify it.

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas
- `.env` file with: MONGO_URI, JWT_SECRET, FRONTEND_URL

### Installation

npm install

### Run Locally

npm run dev

The server runs on http://localhost:3000

## 🧪 API Endpoints

### Auth

| Method | Route           | Description        |
|--------|------------------|--------------------|
| POST   | /api/register    | Register new user  |
| POST   | /api/login       | Login user, returns JWT |

### Projects

| Method | Route                 | Description                        |
|--------|------------------------|------------------------------------|
| GET    | /api/projects          | Get all projects of logged-in user |
| POST   | /api/projects          | Create new project                 |
| GET    | /api/projects/:id      | Get single project by ID           |
| PUT    | /api/projects/:id      | Update project                     |
| DELETE | /api/projects/:id      | Delete project                     |

### Tasks

| Method | Route                                         | Description                        |
|--------|-----------------------------------------------|------------------------------------|
| GET    | /api/projects/:projectId/tasks                | Get tasks for a project            |
| POST   | /api/projects/:projectId/tasks                | Create task in a project           |
| PUT    | /api/tasks/:id                                | Update task                        |
| DELETE | /api/tasks/:id                                | Delete task                        |

> All routes require authentication via Bearer token.

## 🛡️ Security

- Passwords hashed with bcrypt
- JWT-based authentication
- Ownership checks for all operations (middleware)

## 🌐 Deployment

Backend is deployed on Render as a Web Service, connected to MongoDB Atlas.

https://dmytro-pm-app-backend.onrender.com
