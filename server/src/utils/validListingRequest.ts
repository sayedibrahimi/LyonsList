import { ListingObject } from "../types";

export function validListingRequest(reqBody: ListingObject): boolean {
  if (
    reqBody.title &&
    reqBody.description &&
    reqBody.pictures && // Changed from picture to pictures
    Array.isArray(reqBody.pictures) && // Verify it's an array
    reqBody.pictures.length > 0 && // Ensure at least one picture
    reqBody.price &&
    reqBody.condition &&
    reqBody.status &&
    reqBody.sellerID
  ) {
    return true;
  } else {
    return false;
  }
}
