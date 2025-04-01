import express from "express";
const router: express.Router = express.Router();
// import { sellerAuth } from "../middlewares/sellerAuth";
import {
  getAllListings,
  getListingsByCategory,
} from "../controllers/search.controller";

// GET /listings - Get all listings
router.get("/", getAllListings);
router.post("/category", getListingsByCategory);

export default router;
