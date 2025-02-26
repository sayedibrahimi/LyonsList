const express = require("express");
import { register, login } from "../controllers/auth.controller";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);

export default router;
