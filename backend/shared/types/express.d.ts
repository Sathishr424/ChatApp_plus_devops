import { JwtPayload } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      validated?: any;
    }
  }
}

export {};
