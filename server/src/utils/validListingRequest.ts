import { ListingObject } from "../types";

export function validListingRequest(reqBody: ListingObject): boolean {
  if (
    reqBody.title &&
    reqBody.description &&
    reqBody.picture &&
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
