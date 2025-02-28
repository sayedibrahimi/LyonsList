import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
