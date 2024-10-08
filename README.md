# Person Management API

## Description

The **Person Management API** is a RESTful web service built with Node.js and MongoDB that allows users to manage a collection of persons. The API provides functionality for creating, reading, updating, and deleting person records, as well as user authentication. It includes advanced features such as search and pagination for better data management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- User authentication with JWT.
- Create, read, update, and delete person records.
- Search functionality to find persons by name or mobile number.
- Pagination for listing persons.
- Comprehensive error handling.
- Responsive frontend using EJS templates.

## Technologies Used

- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework for building web applications and APIs.
- **MongoDB**: NoSQL database for storing person and user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **EJS**: Templating engine for rendering views.
- **CSS**: Styling for the frontend.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/person-management-api.git
   cd person-management-api

2. **Install dependencies:**
bash
npm install

3. **Create a .env file:**
Duplicate the .env.example file and rename it to .env. Fill in the required environment variables.

4. **Start the MongoDB server (if not using a cloud service):** Make sure you have MongoDB installed and running locally, or use a MongoDB service.

## Run the application:
bash
npm start
The server will start on http://localhost:3000 by default.

## Usage
- You can interact with the API using tools like Postman or curl.
- Access the frontend at http://localhost:3000/person to manage persons via a web interface.

## API Endpoints
**Authentication Routes**
- POST /auth/register: Register a new user.
- POST /auth/login: Authenticate an existing user and obtain a JWT.

**Person Routes**
- GET /person: Retrieve a list of persons.
- GET /person/create: Display a form to create a new person.
- POST /person: Create a new person.
- GET /person/edit/:id: Display a form to edit an existing person by ID.
- PUT /person/:id: Update the person with the specified ID.
- POST /person/delete/:id: Delete the person with the specified ID.
- GET /person/search: Search for persons by name or mobile number.

## Environment Variables
Make sure to configure the following environment variables in your .env file:
MONGODB_URI=mongodb://localhost:27017/person-management
JWT_SECRET=your_secret_key
PORT=3000
- **MONGODB_URI:** Connection string for your MongoDB database.
- **JWT_SECRET:** Secret key for signing JWT tokens.
- **PORT:** The port on which the application will run.
