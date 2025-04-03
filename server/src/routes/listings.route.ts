import express from "express";
const router: express.Router = express.Router();
import { sellerAuth } from "../middlewares/sellerAuth";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller";
import { reportListing } from "../controllers/report.controller";

// POST /listings - Create a new listing
// GET /listings - Get all listings
router.get("/", getAllListings);
router.post("/", createListing);

// GET /listings/:id - Get a listing by ID
// PATCH /listings/:id - Update a listing by ID
// DELETE /listings/:id - Delete a listing by ID
router.get("/:id", getListingById);
router.patch("/:id", sellerAuth, updateListing);
router.delete("/:id", sellerAuth, deleteListing);

router.post("/report/:id", reportListing);

export default router;
