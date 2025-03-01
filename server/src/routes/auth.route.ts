import express from "express";
import { register, login } from "../controllers/auth.controller";
import { resetPassword } from "../controllers/resetPassword";
import auth from "../middlewares/auth";
const router: express.Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/resetPassword", auth, resetPassword);

export default router;
