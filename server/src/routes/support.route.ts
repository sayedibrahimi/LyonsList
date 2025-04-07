import express from "express";
import { sendFeedback } from "../controllers/support.controller";
const router: express.Router = express.Router();

router.post("/feedback", sendFeedback);

export default router;
