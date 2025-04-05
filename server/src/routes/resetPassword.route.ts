import express from "express";
import {
  verifyReset,
  resetPassword,
  resetPasswordRequest,
} from "../controllers/resetPassword.controller";
// import auth from "../middlewares/auth";
const router: express.Router = express.Router();

router.post("/request", resetPasswordRequest);
router.post("/verify", verifyReset);
router.post("/password", resetPassword);

export default router;
