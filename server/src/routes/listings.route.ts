import express from "express";
const router = express.Router();
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller"; // Adjust the import path as needed

// POST /listings - Create a new listing
// GET /listings - Get all listings
// router.route("/").post(createListing).get(getAllListings);
router.get("/", getAllListings);
router.post("/", createListing);

// GET /listings/:id - Get a listing by ID
// PATCH /listings/:id - Update a listing by ID
// DELETE /listings/:id - Delete a listing by ID
router
  .route("/:id")
  .get(getListingById)
  .patch(updateListing)
  .delete(deleteListing);

export default router;
