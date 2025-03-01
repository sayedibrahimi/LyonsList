// ROUTE
import express from "express";
const router = express.Router();
import {
  getUserAccount,
  updateUserAccount,
  deleteUserAccount,
} from "../controllers/user.controller";
import { userAccountAuth } from "../middlewares/userAccountAuth";
router.use(userAccountAuth);

router.get("/", getUserAccount);
router.patch("/", updateUserAccount);
router.delete("/", deleteUserAccount);

export default router;
