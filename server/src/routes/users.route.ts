// ROUTE
import express from "express";
const router = express.Router();
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";

// POST /users - Create a new user
// GET /users - Get all users
router.route("/").post(createUser).get(getAllUsers);

// GET /users/:id - Get a user by ID
// PATCH /users/:id - Update a user by ID
// DELETE /users/:id - Delete a user by ID
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);


export default router;