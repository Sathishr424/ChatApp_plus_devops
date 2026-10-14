import { ErrorException } from "../interfaces/ErrorException";

export class CustomError extends ErrorException {
  constructor(message: string) {
    super(message, 500);
  }
}
