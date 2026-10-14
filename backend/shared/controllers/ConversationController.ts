import { Request, Response, Router } from "express";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import ConversationService from "../services/ConversationService";
import { getAuthenticatedUserId } from "../utils/helper";
import { validateRequest } from "../utils/ValidateRequest";

class ConversationController {
  public router: Router = Router();
  private service = ConversationService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    console.log("Registering /api/conversations/ controller")
    this.router.get("/recent", validateRequest(PaginationDTO, "query"), this.recent.bind(this));
    this.router.get("/unread", validateRequest(PaginationDTO, "query"), this.unread.bind(this));
    this.router.get("/groups", validateRequest(PaginationDTO, "query"), this.groups.bind(this));
  }

  private async recent(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const data = await this.service.getRecent(user_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  // TODO: Update to return unread conversations only
  private async unread(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const data = await this.service.getUnraed(user_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async groups(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const data = await this.service.getGroups(user_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }
}

export default new ConversationController().router;
