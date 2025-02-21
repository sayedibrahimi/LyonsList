// ROUTE
import express from "express";
const router = express.Router();
import { createUser, getAllUsers } from "../controllers/users.controller";

router.route("/").post(createUser).get(getAllUsers);

export default router;
