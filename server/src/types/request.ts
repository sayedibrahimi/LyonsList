import { Request } from "express";
// import { returnObject } from "./return.object";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }
  }
}
