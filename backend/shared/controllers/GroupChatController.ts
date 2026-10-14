import { Request, Response, Router } from "express";
import { MessageRequestDTO } from "../dto/request/MessageRequestDTO";
import { GroupMessageResponseDTO } from "../dto/response/GroupMessageResponseDTO";
import { getAuthenticatedUserId } from "../utils/helper";
import { validateRequest } from "../utils/ValidateRequest";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";
import GroupChatService from "../services/GroupChatService";
import { GroupChatMiddleware } from "../middlewares/GroupChatMiddleware";

class GroupChatController {
  public router: Router = Router();
  private service = GroupChatService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    console.log("Registering /api/conversations/groups controller")
    this.router.get("/:group_id/messages", GroupChatMiddleware, validateRequest(PaginationDTO, "query"), this.getGroupMessages.bind(this));

    this.router.get("/:group_id/messages/search/:search", GroupChatMiddleware, validateRequest(PaginationDTO, "query"), this.getMessagesSearchResults.bind(this));

    this.router.get("/:group_id/messages/load-until/:message_id", GroupChatMiddleware, validateRequest(PaginationDTO, "query"), this.getMessagesUntilMessageId.bind(this));
    this.router.post("/:group_id/messages", GroupChatMiddleware, validateRequest(MessageRequestDTO), this.sentMessage.bind(this));
    this.router.patch("/:group_id/messages/seen", GroupChatMiddleware, this.markSeen.bind(this));

    this.router.get("/:group_id/messages/:message_id", GroupChatMiddleware, this.getMessage.bind(this));
    this.router.delete("/:group_id/messages/:message_id", GroupChatMiddleware, this.deleteMessage.bind(this));
  }

  private async getMessagesSearchResults(req: Request, res: Response) {
    const group_id = Number(req.params.group_id);
    const search = String(req.params.search);
    const data: WithPaginationDTO<number[]> = await this.service.getMessagesSearchResults(group_id, search, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async getMessagesUntilMessageId(req: Request, res: Response) {
    const group_id = Number(req.params.group_id);
    const message_id = Number(req.params.message_id);
    const data: WithPaginationDTO<GroupMessageResponseDTO[]> = await this.service.loadMessagesUntilMessageId(group_id, message_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async getGroupMessages(req: Request, res: Response) {
    const group_id = Number(req.params.group_id);
    const data: WithPaginationDTO<GroupMessageResponseDTO[]> = await this.service.getGroupMessages(group_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async sentMessage(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);

    const message = await this.service.sentMessage(user_id, group_id, req.validated)

    return res.status(200).json({
      success: true,
      message
    });
  }

  private async getMessage(req: Request, res: Response) {
    const message_id = Number(req.params.message_id);

    const message = await this.service.getMessage(message_id);

    return res.status(200).json({
      success: true,
      message
    });
  }

  private async deleteMessage(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const message_id = Number(req.params.message_id);

    await this.service.deleteMessage(user_id, message_id);

    return res.status(200).json({
      success: true,
    });
  }

  private async markSeen(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);

    await this.service.markSeen(user_id, group_id);

    return res.status(200).json({
      success: true,
    });
  }
}

export default new GroupChatController().router;
