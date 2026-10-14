import { ErrorException } from "../interfaces/ErrorException";

export class InvalidToken extends ErrorException {
  constructor() {
    super("INVALID_TOKEN", 403);
  }
}
