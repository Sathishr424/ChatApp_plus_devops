import { Request, Response, Router } from "express";
import { GroupRequestDTO } from "../dto/request/GroupRequestDTO";
import GroupService from "../services/GroupService";
import { validateRequest } from "../utils/ValidateRequest";
import { getAuthenticatedUserId } from "../utils/helper";
import { GroupResponseDTO } from "../dto/response/GroupResponseDTO";
import { PaginationDTO } from "../dto/request/PaginationDTO";

class GroupController {
  public router: Router = Router();
  private service = GroupService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    console.log("Registering /api/groups controller")
    // Group creation and deletion
    this.router.get("/", validateRequest(PaginationDTO, "query"), this.getGroups.bind(this));
    this.router.get("/:group_id/members", this.getGroupMemberIds.bind(this));
    this.router.get("/:group_id", this.getGroup.bind(this));

    this.router.post("/", validateRequest(GroupRequestDTO), this.createGroup.bind(this));
    this.router.patch("/:group_id", validateRequest(GroupRequestDTO), this.updateGroup.bind(this));
    this.router.delete("/:group_id", this.deleteGroup.bind(this));
  }

  private async getGroup(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);
    const group = await this.service.getGroup(user_id, group_id);

    return res.status(200).json({
      success: true,
      group
    });
  }

  private async getGroupMemberIds(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);

    const member_ids = await this.service.getGroupMemberIds(user_id, group_id);

    return res.status(200).json({
      success: true,
      member_ids
    });
  }

  private async getGroups(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const data = await this.service.getGroups(user_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }

  private async createGroup(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group: GroupResponseDTO = await this.service.createGroup(user_id, req.validated);

    return res.status(200).json({
      success: true,
      group: group
    });
  }

  private async updateGroup(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);
    const group: GroupResponseDTO = await this.service.UpdateGroup(user_id, group_id, req.validated);

    return res.status(200).json({
      success: true,
      group: group
    });
  }

  private async deleteGroup(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const group_id = Number(req.params.group_id);
    await this.service.deleteGroup(user_id, group_id);

    return res.status(200).json({
      success: true,
    });
  }
}

export default new GroupController().router;
