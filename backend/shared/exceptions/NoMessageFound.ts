import { ErrorException } from "../interfaces/ErrorException";

export class NoMessageFound extends ErrorException {
  constructor() {
    super("NO_MESSAGE_FOUND", 500);
  }
}
