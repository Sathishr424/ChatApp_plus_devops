import { NotAuthorised } from "../exceptions/NotAuthorised";
import JWTService from "../services/JWTService";
import { getBearerToken } from "../utils/helper";
import { Request, Response, NextFunction } from "express";

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);
  if (token == null) throw new NotAuthorised();
  req.user = JWTService.verify(token);
  return next();
}
