import { ErrorException } from "../interfaces/ErrorException";

export class ServerError extends ErrorException {
  constructor() {
    super("ServerError", 500);
  }
}
