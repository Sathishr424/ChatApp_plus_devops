import { ErrorException } from "../interfaces/ErrorException";

export class NotAuthorised extends ErrorException {
  constructor() {
    super("NOT_AUTHORISED", 403);
  }
}
