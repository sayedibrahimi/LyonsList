import express from "express";
import {
  register,
  login,
  verifyRegistration,
} from "../controllers/auth.controller";
import { resendOtp } from "../utils/generateOTP";
const router: express.Router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/verify-otp", verifyRegistration);
router.post("/resend-otp", resendOtp);

export default router;
