import { ErrorException } from "../interfaces/ErrorException";

export class UserEmailAlreadyInUse extends ErrorException {
  constructor() {
    super("USER_EMAIL_ALREADY_IN_USE", 500);
  }
}
