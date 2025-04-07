import express from "express";
import { sendFeedback, reportIssue } from "../controllers/support.controller";
const router: express.Router = express.Router();

router.post("/feedback", sendFeedback);
router.post("/report-issue", reportIssue);

export default router;
