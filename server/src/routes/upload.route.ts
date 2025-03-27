import express from "express";
const router: express.Router = express.Router();
import { upload, uploadImage } from "../controllers/upload.controller";

router.post("/", upload.single("image"), uploadImage);

export default router;
