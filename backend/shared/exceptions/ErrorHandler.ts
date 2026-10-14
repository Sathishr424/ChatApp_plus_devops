import { Request, Response, NextFunction } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/client";
import { ErrorException } from "../interfaces/ErrorException";

function isPrismaError(error: unknown): boolean {
  return (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError
  );
}

export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (isPrismaError(err)) {
    console.log(err)
    return res.status(500).json({
      error: "PRISMA_ERROR"
    })
  }

  if (err instanceof ErrorException) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  console.log(err);
  return res.status(500).json({
    error: "SERVER_ERROR"
  });
}
