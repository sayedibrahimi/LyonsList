import express from "express";
const router: express.Router = express.Router();
import { createMessage } from "../controllers/messages.controller";

router.post("/", createMessage);

export default router;
