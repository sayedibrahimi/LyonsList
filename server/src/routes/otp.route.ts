import express from "express";
const router: express.Router = express.Router();
import { sendOTPHandler, verifyOTP } from "../controllers/otp.controller";
import { requestPasswordReset } from "../controllers/resetPassword.controller";
import auth from "../middlewares/auth";

router.post("/", sendOTPHandler);
router.post("/verify", verifyOTP);
router.post("/reset-password", auth, requestPasswordReset);

export default router;
