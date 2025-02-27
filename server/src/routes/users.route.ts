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

//! Auth all routes

// POST /users - Create a new user
// GET /users - Get all users
router.post("/", createUser);
router.get("/", getAllUsers);

// GET /users/:id - Get a user by ID
// PATCH /users/:id - Update a user by ID
// DELETE /users/:id - Delete a user by ID
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
