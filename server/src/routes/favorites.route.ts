import express from "express";
const router: express.Router = express.Router();
// import { sellerAuth } from "../middlewares/sellerAuth";
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller";

router.get("/", getAllFavorites);
router.post("/:id", addFavorite);
router.delete("/:id", removeFavorite);

export default router;
