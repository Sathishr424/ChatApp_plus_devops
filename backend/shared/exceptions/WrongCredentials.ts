import { ErrorException } from "../interfaces/ErrorException";

export class WrongCredentials extends ErrorException {
  constructor() {
    super("WRONG_CREDENTIALS", 500);
  }
}
