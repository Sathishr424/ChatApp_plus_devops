import bcrypt from "bcrypt";
import { Request } from "express";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import { User } from "../models/User";

export async function validatePassword(password: string, user: User) {
  return await bcrypt.compare(password, user.password);
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export function getBearerToken(req: Request) {
  const authHeader = req.headers.authorization;

  return authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
}

export function getAuthenticatedUserId(req: Request): number {
  if (!req.user) {
    throw new NotAuthorised();
  }

  return req.user.userId;
}
