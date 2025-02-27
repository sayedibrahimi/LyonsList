import { INTERNAL_SERVER_ERROR } from "http-status-codes";

const ErrorMessages = {
  INTERNAL_SERVER_ERROR: "Internal server error.",

  //   // Boards
  //   BOARD_CREATE_BAD_REQUEST: "Bad request: Please provide a valid board name.", // controllers/boards.js
  //   BOARD_NOT_FOUND: "Board not found.",
  //   BOARD_NO_ACCESS: "User does not have access to this board.",
  //   BOARD_DELETE_NO_ACCESS: "User does not have permission to delete this board.",

  //   // Task Lists
  //   TASKLIST_CREATE_BAD_REQUEST:
  //     "Bad request: Please provide a valid task list name and board ID.",
  //   TASKLIST_NOT_FOUND: "Task list not found.",
  //   TASKLIST_MISSING_BOARD: "Task list found but no board ID specified.",

  //   // Tasks
  //   TASK_CREATE_BAD_REQUEST:
  //     "Bad request: Please provide a valid task header, board ID, and task list ID.",
  //   TASK_NOT_FOUND: "Task not found.",
  //   TASK_MISSING_TASKLIST: "Task found but no task list ID specified.",

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
