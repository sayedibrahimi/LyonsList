import express from "express";
import {
  register,
  login,
  verifyRegistration,
} from "../controllers/auth.controller";
const router: express.Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyRegistration);

export default router;
