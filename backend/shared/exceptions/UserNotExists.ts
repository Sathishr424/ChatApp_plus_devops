import { ErrorException } from "../interfaces/ErrorException";

export class UserNotExists extends ErrorException {
  constructor() {
    super("USER_NOT_FOUND", 500);
  }
}
