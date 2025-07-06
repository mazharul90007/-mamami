# Mamami Dating App API Documentation

## Overview
This is the backend API for the Mamami dating app with wellness AI features. The API handles user authentication, profile management, and identity verification.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## API Endpoints

### 1. User Authentication

#### Register User
```http
POST /user/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "isEmailVerified": false,
    "isAccountVerified": false,
    "imageVerified": false,
    "gender": null,
    "interestedIn": null,
    "heightFeet": null,
    "heightInches": null,
    "address": null,
    "city": null,
    "state": null,
    "zipCode": null,
    "idType": null,
    "idPhotoUrl": null,
    "profilePhotoUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "isEmailVerified": false,
      "isAccountVerified": false,
      "imageVerified": false,
      "gender": null,
      "interestedIn": null,
      "heightFeet": null,
      "heightInches": null,
      "address": null,
      "city": null,
      "state": null,
      "zipCode": null,
      "idType": null,
      "idPhotoUrl": null,
      "profilePhotoUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### 2. File Upload

#### Upload ID Photo
```http
POST /user/upload-id-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- idPhoto: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "ID photo uploaded successfully",
  "data": {
    "filename": "uuid-timestamp.jpg",
    "fileUrl": "http://localhost:5000/uploads/profile-pictures/uuid-timestamp.jpg"
  }
}
```

#### Upload Profile Photo
```http
POST /user/upload-profile-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- profilePhoto: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "filename": "uuid-timestamp.jpg",
    "fileUrl": "http://localhost:5000/uploads/profile-pictures/uuid-timestamp.jpg"
  }
}
```

### 3. Profile Management

#### Update ID Verification
```http
PATCH /user/id-verification
Authorization: Bearer <token>
Content-Type: application/json

{
  "idType": "NATIONAL_ID",
  "idPhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
  "profilePhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
  "imageVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "ID verification updated successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "isEmailVerified": false,
    "isAccountVerified": false,
    "imageVerified": true,
    "idType": "NATIONAL_ID",
    "idPhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
    "profilePhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
    // ... other fields
  }
}
```

#### Update Gender
```http
PATCH /user/gender
Authorization: Bearer <token>
Content-Type: application/json

{
  "gender": "WOMEN"
}
```

**Gender Options:**
- `WOMEN`
- `MEN`
- `NONBINARY`

#### Update Interest Preference
```http
PATCH /user/interested-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "interestedIn": "BOTH"
}
```

**Interest Options:**
- `WOMEN`
- `MEN`
- `BOTH`

#### Update Height
```http
PATCH /user/height
Authorization: Bearer <token>
Content-Type: application/json

{
  "heightFeet": 5,
  "heightInches": 7
}
```

#### Update Location
```http
PATCH /user/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location updated successfully and account verified",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "isEmailVerified": false,
    "isAccountVerified": true,
    "imageVerified": true,
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    // ... other fields
  }
}
```

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "isEmailVerified": false,
    "isAccountVerified": true,
    "imageVerified": true,
    "gender": "WOMEN",
    "interestedIn": "BOTH",
    "heightFeet": 5,
    "heightInches": 7,
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "idType": "NATIONAL_ID",
    "idPhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
    "profilePhotoUrl": "http://localhost:5000/uploads/profile-pictures/filename.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## User Flow

### Complete Onboarding Process:

1. **Signup** → `POST /user/signup`
2. **Login** → `POST /user/login`
3. **Upload ID Photo** → `POST /user/upload-id-photo`
4. **Upload Profile Photo** → `POST /user/upload-profile-photo`
5. **Update ID Verification** → `PATCH /user/id-verification`
6. **Update Gender** → `PATCH /user/gender`
7. **Update Interest** → `PATCH /user/interested-in`
8. **Update Height** → `PATCH /user/height`
9. **Update Location** → `PATCH /user/location` (completes account verification)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

## File Upload Requirements

- **Supported formats:** JPEG, PNG, GIF, WebP
- **Maximum file size:** 5MB
- **Image processing:** Automatically resized to 300x300px and compressed
- **Storage:** Files are saved to `public/uploads/profile-pictures/`

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mamami_db"

# Server
NODE_ENV=development
PORT=5000
BASE_URL_SERVER=http://localhost:5000

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_SALT_ROUNDS=12
```

## Database Schema

The API uses PostgreSQL with Prisma ORM. Key models:

- **User:** Complete user profile with authentication and verification status
- **Enums:** Gender, InterestedIn, IdType for type safety

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation with Zod
- File upload security (type and size validation)
- CORS configuration
- Global error handling 