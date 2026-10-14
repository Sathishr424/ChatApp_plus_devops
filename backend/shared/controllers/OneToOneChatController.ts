import { Request, Response, Router } from "express";
import { MessageRequestDTO } from "../dto/request/MessageRequestDTO";
import { MessageResponseDTO } from "../dto/response/MessageResponseDTO";
import { getAuthenticatedUserId } from "../utils/helper";
import { validateRequest } from "../utils/ValidateRequest";
import OneToOneChatService from "../services/OneToOneChatService";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";

class OneToOneChatController {
  public router: Router = Router();
  private service = OneToOneChatService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    console.log("Registering /api/conversations/one-to-one controller")
    this.router.get("/:user_id/messages", validateRequest(PaginationDTO, "query"), this.getUserMessages.bind(this));
    this.router.get("/:user_id/messages/search/:search", validateRequest(PaginationDTO, "query"), this.getMessagesSearchResults.bind(this));
    this.router.get("/:user_id/messages/load-until/:message_id", validateRequest(PaginationDTO, "query"), this.getMessagesUntilMessageId.bind(this));
    this.router.post("/:user_id/messages", validateRequest(MessageRequestDTO), this.sentMessage.bind(this));

    this.router.patch("/messages/:user_id/seen", this.markSeen.bind(this));
    this.router.get("/messages/:message_id", this.getMessage.bind(this));
    this.router.delete("/messages/:message_id", this.deleteMessage.bind(this));
  }

  private async getMessagesSearchResults(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const to_id = Number(req.params.user_id);
    const search = String(req.params.search);
    const data: WithPaginationDTO<number[]> = await this.service.getMessagesSearchResults(user_id, to_id, search, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async getMessagesUntilMessageId(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const to_id = Number(req.params.user_id);
    const message_id = Number(req.params.message_id);
    const data: WithPaginationDTO<MessageResponseDTO[]> = await this.service.loadMessagesUntilMessageId(user_id, to_id, message_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async getUserMessages(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const to_id = Number(req.params.user_id);
    const data: WithPaginationDTO<MessageResponseDTO[]> = await this.service.getUserMessages(user_id, to_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async sentMessage(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const to_id = Number(req.params.user_id);

    const message = await this.service.sentMessage(user_id, to_id, req.validated)

    return res.status(200).json({
      success: true,
      message
    });
  }

  private async getMessage(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const message_id = Number(req.params.message_id);

    const message = await this.service.getMessage(user_id, message_id);

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
    const from_id = Number(req.params.user_id);

    await this.service.markSeen(user_id, from_id);

    return res.status(200).json({
      success: true,
    });
  }
}

export default new OneToOneChatController().router;
