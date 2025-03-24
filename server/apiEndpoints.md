# MarketPlace API Documentation

This document outlines all available API endpoints for the MarketPlace application.

## Base URL
All endpoints are prefixed with: `/api/v1`

## Authentication

### Register User
Creates a new user account and sends verification OTP.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "data": {
      "email": "john.doe@example.com",
      "message": "OTP sent successfully"
    }
  }
  ```

### Verify Registration
Verifies a new user's account with the OTP they received.

- **URL**: `/auth/verify-registration`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  }
  ```

### Login
Logs in an existing user.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  }
  ```

### Request Password Reset
Sends an OTP for password reset.

- **URL**: `/auth/reset-password-request`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "data": {
      "message": "Password reset OTP sent to your email"
    }
  }
  ```

### Verify Reset Password
Verifies the OTP and resets the password.

- **URL**: `/auth/verify-reset`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456",
    "password1": "newPassword123",
    "password2": "newPassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successful",
    "data": {
      "user": "john.doe@example.com",
      "message": "Password reset successfully"
    }
  }
  ```

## User Account Management

### Get Account
Retrieves the authenticated user's account information.

- **URL**: `/account`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User account retrieved successfully",
    "data": {
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "verified": true,
        "createdAt": "2023-03-01T12:00:00.000Z"
      }
    }
  }
  ```

### Update Account
Updates the authenticated user's account information.

- **URL**: `/account`
- **Method**: `PATCH`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "firstName": "Johnny",
    "lastName": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User account updated successfully",
    "data": {
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "firstName": "Johnny",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      }
    }
  }
  ```

### Delete Account
Deletes the authenticated user's account.

- **URL**: `/account`
- **Method**: `DELETE`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User account deleted successfully",
    "data": null
  }
  ```

## Listings

### Get All Listings
Retrieves all available listings.

- **URL**: `/listings`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search term
  - `category`: Filter by category
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `condition`: Filter by condition
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listings fetched successfully",
    "data": {
      "listings": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "MacBook Pro 2021",
          "description": "Excellent condition, barely used",
          "pictures": ["url1.jpg", "url2.jpg"],
          "price": 1200,
          "condition": "Used",
          "category": "Electronics & Gadgets",
          "status": "Available",
          "sellerID": {
            "_id": "60d21b4667d0d8992e610c85",
            "firstName": "John",
            "lastName": "Doe"
          },
          "createdAt": "2023-03-01T12:00:00.000Z"
        }
      ],
      "totalListings": 25,
      "currentPage": 1,
      "totalPages": 3
    }
  }
  ```

### Get Single Listing
Retrieves a specific listing by ID.

- **URL**: `/listings/:id`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing fetched successfully",
    "data": {
      "listing": {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "MacBook Pro 2021",
        "description": "Excellent condition, barely used",
        "pictures": ["url1.jpg", "url2.jpg"],
        "price": 1200,
        "condition": "Used",
        "category": "Electronics & Gadgets",
        "status": "Available",
        "sellerID": {
          "_id": "60d21b4667d0d8992e610c85",
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2023-03-01T12:00:00.000Z"
      }
    }
  }
  ```

### Create Listing
Creates a new listing.

- **URL**: `/listings`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "MacBook Pro 2021",
    "description": "Excellent condition, barely used",
    "pictures": ["url1.jpg", "url2.jpg"],
    "price": 1200,
    "condition": "Used",
    "category": "Electronics & Gadgets",
    "status": "Available"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing created successfully",
    "data": {
      "listing": {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "MacBook Pro 2021",
        "description": "Excellent condition, barely used",
        "pictures": ["url1.jpg", "url2.jpg"],
        "price": 1200,
        "condition": "Used",
        "category": "Electronics & Gadgets",
        "status": "Available",
        "sellerID": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-03-01T12:00:00.000Z"
      }
    }
  }
  ```

### Update Listing
Updates an existing listing. Only the owner can update their listing.

- **URL**: `/listings/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "price": 1100,
    "status": "Unavailable"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing updated successfully",
    "data": {
      "listing": {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "MacBook Pro 2021",
        "description": "Excellent condition, barely used",
        "pictures": ["url1.jpg", "url2.jpg"],
        "price": 1100,
        "condition": "Used",
        "category": "Electronics & Gadgets",
        "status": "Unavailable",
        "sellerID": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-03-01T12:00:00.000Z"
      }
    }
  }
  ```

### Delete Listing
Deletes a listing. Only the owner can delete their listing.

- **URL**: `/listings/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing deleted successfully",
    "data": null
  }
  ```

## Favorites

### Get All Favorites
Retrieves all favorites for the authenticated user.

- **URL**: `/favorites`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Favorites fetched successfully",
    "data": {
      "favorites": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "MacBook Pro 2021",
          "description": "Excellent condition, barely used",
          "pictures": ["url1.jpg", "url2.jpg"],
          "price": 1200,
          "condition": "Used",
          "category": "Electronics & Gadgets",
          "status": "Available",
          "sellerID": {
            "_id": "60d21b4667d0d8992e610c85",
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  }
  ```

### Add Favorite
Adds a listing to the user's favorites.

- **URL**: `/favorites/:id`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing added to favorites successfully",
    "data": {
      "favorites": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "MacBook Pro 2021",
          "description": "Excellent condition, barely used",
          "pictures": ["url1.jpg", "url2.jpg"],
          "price": 1200,
          "condition": "Used",
          "category": "Electronics & Gadgets",
          "status": "Available",
          "sellerID": {
            "_id": "60d21b4667d0d8992e610c85",
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  }
  ```

### Remove Favorite
Removes a listing from the user's favorites.

- **URL**: `/favorites/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (JWT Token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Listing removed from favorites successfully",
    "data": {
      "favorites": []
    }
  }
  ```

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error message description",
    "statusCode": 400
  }
}
```

Common status codes:
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

To get a token, either login or register and verify your account.
