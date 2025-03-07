import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
