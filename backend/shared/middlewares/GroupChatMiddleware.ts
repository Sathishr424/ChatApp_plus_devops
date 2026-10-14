import { NextFunction, Request, Response } from "express";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import GroupChatRepository from "../repositories/GroupChatRepository";
import { getAuthenticatedUserId } from "../utils/helper";
import { CustomError } from "../exceptions/CustomError";

export async function GroupChatMiddleware(req: Request, res: Response, next: NextFunction) {
  const group_id = Number(req.params.group_id);
  const user_id = getAuthenticatedUserId(req);

  if (!Number.isInteger(group_id)) {
    throw new CustomError("Invalid group_id");
  }

  const isMember = await GroupChatRepository.isUserInTheGroup(
    user_id,
    group_id
  );

  if (!isMember) {
    throw new NotAuthorised();
  }

  return next();
}
