import express from "express";
const router: express.Router = express.Router();
import { sellerAuth } from "../middlewares/sellerAuth";
import {
  createListing,
  getAllUsersListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller";
import {
  getAllListings,
  getListingsByCategory,
} from "../controllers/search.controller";
import { reportListing } from "../controllers/report.controller";

// POST /listings - Create a new listing
// GET /listings - Get all listings
router.get("/", getAllUsersListings);
router.post("/", createListing);

// POST /listings/report/:id - Report a listing by ID
router.post("/report/:id", reportListing);

// GET /listings - Get all listings
router.get("/search", getAllListings);
router.post("/search/category", getListingsByCategory);

// GET /listings/:id - Get a listing by ID
// PATCH /listings/:id - Update a listing by ID
// DELETE /listings/:id - Delete a listing by ID
router.get("/:id", getListingById);
router.patch("/:id", sellerAuth, updateListing);
router.delete("/:id", sellerAuth, deleteListing);

export default router;
