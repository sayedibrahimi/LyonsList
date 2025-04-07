# Wheaton Marketplace - Server API

This is the backend API server for the Wheaton Marketplace platform, built with Node.js, Express, MongoDB, and TypeScript.

## Features

- **User Authentication**: JWT-based authentication system
- **Email Verification**: OTP verification via email
- **Password Reset**: Secure password reset flow
- **Listings Management**: CRUD operations for product listings
- **Favorites**: Save and manage favorite listings
- **Image Processing**: Process and store product images
- **AI Image Analysis**: Analyze product images using Google's Gemini AI
- **Error Handling**: Comprehensive error handling system
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **AI**: Google Gemini AI
- **Validation**: Custom validation middleware
- **Caching**: Node-cache for OTP storage

## API Structure

```
server/
├── src/                  # Source code
│   ├── app.ts            # Main application file
│   ├── constants/        # Constant values and error messages
│   ├── controllers/      # Request handlers
│   ├── db/               # Database configuration
│   ├── errors/           # Custom error classes
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Utility functions
└── tsconfig.json         # TypeScript configuration
```

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/wheaton-marketplace.git
   cd wheaton-marketplace/server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/wheaton-marketplace
   JWT_SECRET=your_jwt_secret_key
   JWT_LIFETIME_HOURS=24
   EMAIL=your_gmail_address@gmail.com
   APP_PASSWORD=your_gmail_app_password
   API_BASE_PATH=/api/v1
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Running the Server

### Development

```bash
npm start
```

This will start the server using nodemon, which will automatically restart on file changes.

### Production

```bash
npm run build
node dist/app.js
```

## API Documentation

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | /auth/register       | Register a new user         |
| POST   | /auth/login          | Login an existing user      |
| POST   | /auth/verify-otp     | Verify OTP for registration |
| POST   | /auth/resend-otp     | Resend OTP                  |
| POST   | /auth/reset-password | Request password reset      |
| POST   | /auth/verify-reset   | Verify password reset OTP   |

### Listings

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | /listings            | Get all listings by current user |
| POST   | /listings            | Create a new listing             |
| GET    | /listings/:id        | Get a specific listing           |
| PATCH  | /listings/:id        | Update a specific listing        |
| DELETE | /listings/:id        | Delete a specific listing        |
| POST   | /listings/report/:id | Report a listing                 |

### Favorites

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | /favorites     | Get all favorites               |
| POST   | /favorites/:id | Add a listing to favorites      |
| DELETE | /favorites/:id | Remove a listing from favorites |

### Search

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | /search          | Get all listings except own |
| POST   | /search/category | Get listings by category    |

### User Account

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | /account | Get user account info |
| PATCH  | /account | Update user account   |
| DELETE | /account | Delete user account   |

### Image Upload

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| POST   | /upload  | Upload image and get AI analysis |

## Error Handling

The API returns consistent error responses with the following format:

```json
{
  "success": false,
  "error": {
    "message": "Detailed error message",
    "statusCode": 400
  }
}
```

## Database Models

### User Schema

- firstName (String)
- lastName (String)
- email (String)
- password (String, hashed)
- classYear (Number)
- profilePicture (String)
- totalListings (Number)
- favorites (Array of ObjectIds)
- verified (Boolean)

### Listing Schema

- title (String)
- description (String)
- pictures (Array of Strings)
- price (Number)
- condition (String)
- category (String)
- status (String)
- sellerID (ObjectId)

## AI Integration

The server uses Google's Gemini API to analyze product images. When an image is uploaded through the `/upload` endpoint, the API processes it and returns suggested listing details including:

- Product title
- Description
- Estimated price
- Appropriate category

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
