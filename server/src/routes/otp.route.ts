import express from "express";
const router: express.Router = express.Router();
import { sendOTPHandler, verifyOTP } from "../controllers/otp.controller";

router.post("/", sendOTPHandler);
router.post("/verify", verifyOTP);

export default router;
