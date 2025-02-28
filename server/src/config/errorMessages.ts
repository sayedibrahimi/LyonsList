import { INTERNAL_SERVER_ERROR } from "http-status-codes";

const ErrorMessages = {
  INTERNAL_SERVER_ERROR: "Internal server error.",

  //   // Boards
  //   BOARD_CREATE_BAD_REQUEST: "Bad request: Please provide a valid board name.", // controllers/boards.js
  //   BOARD_NOT_FOUND: "Board not found.",
  //   BOARD_NO_ACCESS: "User does not have access to this board.",
  //   BOARD_DELETE_NO_ACCESS: "User does not have permission to delete this board.",

  // Listings
  LISTING_NOT_FOUND: "Listing not found.", // controllers/listings.js
  LISTING_NO_ACCESS: "User does.",
  LISTING_CREATION_FAILED: "Listing creation failed.", // controllers/listings.js
  LISTING_NOT_FOUND_BY_ID: "Listing not found by ID.", // controllers/listings.js
  LISTING_NO_LISTINGS_CREATED: "No listings have been created yet.", // controllers/listings.js
  LISTING_NO_LISTINGS_FOUND: "No listings found.", // controllers/listings.js

  USER_LISTINGS_NOT_FOUND: "User listings not found.", // controllers/listings.js
  USER_LISTINGS_NO_ACCESS: "User listings do not exist.", // controllers/listings.js
  USER_LISTINGS_NO_LISTINGS: "User has no listings.", // controllers/listings.js
  LISTING_NOT_AUTHORIZED: "User is not authorized to access this listing.", // controllers/listings.js
  // controllers/listings.js

  // Users
  USER_MISSING_FIELDS:
    "Please provide a valid first name, last name, email, and password.", // controllers/auth.controller.ts
  USER_EMAIL_IN_USE: "An account already exists with this email.",
  //   USER_NOT_ACTIVE: "User is inactive.", // controllers/auth.js
  //   USER_INVALID_SEARCH_CRITERIA: "Invalid search criteria.",
  USER_NOT_FOUND: "User not found.", // controllers/users.js
  USER_CREATION_FAILED: "User creation failed.", // controllers/users.js
  USER_NO_USERS_CREATED: "No users have been created yet.", // controllers/users.js
  USER_NOT_FOUND_BY_ID: "User not found by ID.", // controllers/users.js

  // Authentication
  //   AUTH_BAD_REQUEST: "Bad request: Please enter valid email and password.", // controllers/auth.js
  AUTH_INVALID_CREDENTIALS:
    "Invalid credentials: please ensure email and password match.", // controllers/auth.js
  AUTH_NO_EMAIL_MATCH:
    "No account exists with this email, check email was entered correctly.", // controllers/auth.js
  AUTH_NO_PASSWORD_MATCH:
    "Password does not match, check it was entered correctly.", // controllers/auth.js
  //   AUTH_NO_TOKEN: "Authorization token missing.", // middlewares/auth.js
  //   AUTH_TOKEN_NOT_VALID: "Invalid token:", // middlewares/auth.js
  //   AUTH_BOARD_NOT_DETERMINED: "Board ID not provided.",
};

export default ErrorMessages;
