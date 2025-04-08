import express from "express";
const router: express.Router = express.Router();
import { uploadImage } from "../controllers/upload.controller";

router.post("/", uploadImage);

export default router;
