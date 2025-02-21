// ROUTE
import express from "express";
const router = express.Router();
import { createUser, getAllUsers, getUserById } from "../controllers/users.controller";

router.route("/").post(createUser).get(getAllUsers);
router.route("/:id").get(getUserById);

export default router;
