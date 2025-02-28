import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
