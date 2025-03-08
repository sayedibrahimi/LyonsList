import express from "express";
const router: express.Router = express.Router();
import { sendOTP, verifyOTP } from "../controllers/otp.controller";

router.post("/", sendOTP);
router.post("/verify", verifyOTP);

export default router;
