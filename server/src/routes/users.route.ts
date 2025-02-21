// ROUTE
import express from "express";
const router = express.Router();
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/users.controller";

router.route("/").post(createUser).get(getAllUsers);
router.route("/:id").get(getUserById).patch(updateUser);

export default router;
