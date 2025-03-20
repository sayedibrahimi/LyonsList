const ListingMessages: Record<string, string> = {
  MISSING_TITLE: "Please provide a title",
  MISSING_DESCRIPTION: "Please provide a description",
  MISSING_PICTURES: "Please provide at least one picture URL",
  MISSING_PRICE: "Please provide a price",
  MISSING_CATEGORY: "Please provide a category",
  MISSING_CONDITION: "Please provide the condition",
  MISSING_STATUS: "Please provide the status",

  INVALID_PRICE: "Price cannot be negative",
  INVALID_PICTURES: "At least one picture URL is required",
  INVALID_CATEGORY: "{VALUE} is not a valid category", // Placeholder for category validation

  TITLE_TOO_LONG: "Title cannot be more than 100 characters",
  DESCRIPTION_TOO_LONG: "Description cannot be more than 500 characters",
  INVALID_CONDITION: "{VALUE} is not a valid condition",
  INVALID_STATUS: "{VALUE} is not a valid status",

  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  NEW: "new",
  USED: "used",

  PROVIDE_SELLER_ID: "Please provide a seller ID",
};

export default ListingMessages;
