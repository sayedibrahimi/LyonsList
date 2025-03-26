import ListingObject from "./ListingObject";
import { UserRequestObject } from "./UserRequest";

export default interface ReportForm {
  listingID: string;
  listingData: ListingObject;
  reporterData: UserRequestObject;
  sellerData: UserRequestObject;
  category: string;
  message?: string;
  status: string;
  createdAt: Date;
}
