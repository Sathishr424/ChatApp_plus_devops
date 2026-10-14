import { ErrorException } from "../interfaces/ErrorException";

export class GroupNotExists extends ErrorException {
  constructor() {
    super("GROUP_NOT_FOUND", 500);
  }
}
