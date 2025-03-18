import express from "express";
import { register, login, verifyOTP } from "../controllers/auth.controller";
const router: express.Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);

export default router;
