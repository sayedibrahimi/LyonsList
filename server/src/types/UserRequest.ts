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

declare global {
  namespace Express {
    interface Request {
      user?: {
        userID: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }
  }
}
