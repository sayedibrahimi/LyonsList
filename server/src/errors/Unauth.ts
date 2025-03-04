import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";

export class UnauthError extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
