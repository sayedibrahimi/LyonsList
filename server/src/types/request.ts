import { Request } from "express";
// import { returnObject } from "./return.object";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userID: string;
//         firstName: string;
//         lastName: string;
//         email: string;
//       };
//     }
//   }
// }

export interface UserRequest extends Request {
  user: {
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
