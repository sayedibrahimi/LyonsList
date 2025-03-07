import express from "express";
const router: express.Router = express.Router();
import { sellerAuth } from "../middlewares/sellerAuth";
import {
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller";

router.post("/:id", sellerAuth, addFavorite);
router.delete("/:id", sellerAuth, removeFavorite);

export default router;
