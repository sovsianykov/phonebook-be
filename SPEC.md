# Phonebook Backend – Technical Specification

## Overview

This project is a **backend API for a Phonebook / Contact Manager application** built with **NestJS**.  
The application allows users to securely store, manage, and retrieve personal contacts.

The system implements **JWT-based authentication using HTTP-only cookies**, ensuring secure session handling.  
Data is stored in a **PostgreSQL database**, and **Prisma ORM** is used for type-safe database access.

The API includes **strict request validation**, **consistent error handling**, and **structured error notifications** to ensure reliability and maintainability.

---

# Architecture

## Core Technologies

- **Framework:** NestJS
- **Language:** TypeScript
- **Authentication:** JWT
- **Session Storage:** HTTP-only Cookies
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** class-validator / class-transformer
- **Error Handling:** Global exception filters and structured responses

---

# Authentication

Authentication is implemented using **JWT tokens stored in HTTP-only cookies**.

### Flow

1. User sends login credentials.
2. Server validates the credentials.
3. If valid, the server generates a **JWT access token**.
4. The token is stored in an **HTTP-only cookie**.
5. Subsequent requests automatically include the cookie.
6. Use DTO's
7. Use .env file for local enviroment
8. Use AuthGuard conception
9. Use config.ts
10.Use prefix "api/v1" 


### Security

- Cookies are **HTTP-only** to prevent JavaScript access.
- Tokens are verified on protected routes using **NestJS guards**.
- Expired or invalid tokens return **401 Unauthorized**.

---

# Database

The application uses **PostgreSQL** as the primary database.

**Prisma ORM** is used for:

- Type-safe database queries
- Schema migrations
- Data modeling
- Efficient query building

---

# Core Entities

## User

Represents an authenticated user of the application.

Fields may include:

- id
- email
- password (hashed)
- createdAt
- updatedAt

---

## Contact

Represents a contact stored in the user's phonebook.

Fields may include:

- id
- name
- phone
- email
- address
- notes
- createdAt
- updatedAt
- userId (owner of the contact)

---

# API Features

The backend provides the following core functionality:

### Authentication

- User registration
- User login
- User logout
- JWT validation

### Contact Management

Authenticated users can:

- Create contacts
- View contacts
- Update contacts
- Delete contacts
- Search contacts

---

# Validation

All incoming requests are validated using **DTO validation**.

Validation ensures:

- Required fields are present
- Email and phone formats are correct
- Invalid data is rejected before reaching business logic

Invalid input returns a **400 Bad Request** response with validation details.

---

# Error Handling

The application uses **centralized error handling**.

Errors are processed using:

- NestJS **Exception Filters**
- Structured error responses
- Standard HTTP status codes

### Example Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}


CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started