import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ErrorMessages from "../config/errorMessages";

export async function notFound(req: Request, res: Response): Promise<void> {
  res.status(StatusCodes.NOT_FOUND).send(ErrorMessages.ROUTE_DOES_NOT_EXIST);
}
