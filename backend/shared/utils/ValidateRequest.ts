import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../exceptions/CustomError";

type RequestSource = "body" | "query" | "params";

export function validateRequest<T extends Object>(
  dto: new () => T,
  source: RequestSource = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const reqDTO = plainToInstance(dto, data);
    const errors = await validate(reqDTO);

    if (errors.length > 0) {
      const fields = errors.map(error => error.property);

      return next(
        new CustomError(
          "INVALID_FIELDS: " + fields.join(", ")
        )
      );
    }

    req.validated = reqDTO as any;
    next();
  }
}
