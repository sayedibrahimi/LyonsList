import express from "express";
const router: express.Router = express.Router();
import { uploadImage } from "../controllers/upload.controller";
import hostImage from "../utils/uploadImage";

router.post("/", uploadImage);
router.post("/image", (req, res) => {
  const { imageBase64, fileName } = req.body;
  hostImage(imageBase64, fileName)
    .then((result) => {
      res
        .status(200)
        .json({ message: "Image uploaded successfully", url: result });
    })
    .catch((error) => {
      res.status(500).json({ message: "Image upload failed", error });
    });
});

export default router;
