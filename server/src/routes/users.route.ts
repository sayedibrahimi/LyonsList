// ROUTE
import express from "express";
const router = express.Router();
import {createUser} from "../controllers/users.controller";

router.route("/").post(createUser);

export default router;
