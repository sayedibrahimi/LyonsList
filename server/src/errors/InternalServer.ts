import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";
export class InternalServerError extends CustomError {
  public errors: unknown;

  constructor(message: string, error?: unknown) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.errors = { message, error };
  }
}
