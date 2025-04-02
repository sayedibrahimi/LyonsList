import express from "express";
import {
  register,
  login,
  verifyRegistration,
} from "../controllers/auth.controller";
import {
  resetPasswordRequest,
  verifyReset,
} from "../controllers/resetPassword.controller";
import { resendOtp } from "../utils/generateOTP";
const router: express.Router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/verify-otp", verifyRegistration);
router.post("/resend-otp", resendOtp);

router.post("/reset-password", resetPasswordRequest);
router.post("/verify-reset", verifyReset);

export default router;
