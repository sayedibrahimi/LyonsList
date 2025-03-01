import { Request } from "express";

export interface UserRequestObject {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserRequest extends Request {
  user: UserRequestObject;
}

// Module augmentation for Express Request
declare module "express" {
  export interface Request {
    user?: {
      userID: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
}
