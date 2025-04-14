# LyonsList - Mobile Client

This is the frontend mobile application for the LyonsList platform, built with React Native, Expo, and TypeScript.

## Features

- **Authentication Flow**: Signup, login, OTP verification, password reset
- **Product Browsing**: Search and filter product listings
- **Product Creation**: Create listings with AI assistance for product details
- **Favorites Management**: Save and manage favorite listings
- **Profile Management**: View and edit user profile
- **User Listings**: Manage your own product listings

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom styled components
- **State Management**: Context API
- **Form Handling**: Custom form handling

## Project Structure

```
client/
├── app/                  # Main application screens using Expo Router
│   ├── (tabs)/           # Tab-based navigation screens
│   └── auth/             # Authentication screens
├── assets/               # Static assets like images
├── components/           # Reusable UI components
├── constants/            # Constants and theme configuration
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── screens/              # Screen components
├── services/             # API service functions
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/sayedibrahimi/LyonsList.git
   cd lyons-list/client
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_BASE_URL=http://localhost:3000/api/v1
   ```

## Running the App

Start the development server:

```bash
npx expo start
```

This will give you options to:

- Run on iOS simulator (requires macOS and Xcode)
- Run on Android emulator (requires Android Studio)
- Run on a physical device using the Expo Go app

## Building for Production

### Build for Android

```bash
expo build:android
```

### Build for iOS

```bash
expo build:ios
```

## Key Features Implementation

### Authentication

The app uses JWT token-based authentication, stored in AsyncStorage for persistence. The AuthContext provides authentication state and methods throughout the app.

### AI Listing Creation

The app uses the server's integration with Google's Gemini AI to automatically generate product details from photos. When creating a listing, users can take a photo and the AI will suggest a title, description, price, and category.

### Image Handling

Images are captured using the device's camera or selected from the gallery using Expo's image picker and camera APIs.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
