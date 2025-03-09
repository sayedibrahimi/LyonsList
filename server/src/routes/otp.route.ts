import express from "express";
const router: express.Router = express.Router();
import { sendOTPHandler, verifyOTP } from "../controllers/otp.controller";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/resetPassword.controller";
import auth from "../middlewares/auth";

router.post("/", sendOTPHandler);
router.post("/verify", verifyOTP);
router.post("/reset-request", auth, requestPasswordReset);
router.post("/reset-password", auth, resetPassword);

export default router;
