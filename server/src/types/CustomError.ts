export class CustomError extends Error {
  statusCode?: number;
  errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export interface CustomErrorObject {
  statusCode: number;
  errors: unknown;
}
