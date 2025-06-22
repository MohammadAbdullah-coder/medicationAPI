Medication Management System – User Authentication Backend
Project Overview
This project is a Node.js-based backend API designed to manage user registration, authentication, and account operations for a Medication Management System. It leverages SQLite for database storage and JWT for secure session handling. The backend provides essential endpoints to register users, authenticate credentials, and manage user data.

Technologies Used
Node.js & Express.js – Server-side framework for handling API routes

SQLite – Lightweight relational database engine

bcrypt – Secure password hashing

jsonwebtoken (JWT) – Token-based authentication

CORS – Cross-origin resource sharing enabled

RESTful API Design – For clear, scalable endpoints

Key Functionalities
User Registration (/login/AddUser/)

Adds a new user with hashed password if the username is unique.

User Authentication (/login/user/)

Validates username and password.

On success, returns a JWT token for secure session handling.

User Listing (/login/)

Returns all registered users (for admin/debug purposes).

User Deletion (/login/:username)

Deletes a user based on username.

Security Features
Passwords are hashed using bcrypt before being stored.

Secure login with JWT tokens, using a secret key for encryption.
