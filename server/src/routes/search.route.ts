import express from "express";
const router: express.Router = express.Router();
// import { sellerAuth } from "../middlewares/sellerAuth";
import { getAllListings } from "../controllers/search.controller";

// GET /listings - Get all listings
router.get("/", getAllListings);

export default router;
