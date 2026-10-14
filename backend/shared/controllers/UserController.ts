import { Request, Response, Router } from "express";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { UserResponseDTO } from "../dto/response/UserResponseDTO";
import UserService from "../services/UserService";
import { getAuthenticatedUserId } from "../utils/helper";
import { validateRequest } from "../utils/ValidateRequest";
import { UsersUpdateDTO } from "../dto/request/UserUpdateDTO";

class UserController {
  public router: Router = Router();
  private service = UserService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    console.log("Registering /api/users/ controller")
    this.router.get("/me", this.me.bind(this));
    this.router.get("/", validateRequest(PaginationDTO, "query"), this.getUsers.bind(this));
    this.router.get("/:user_id", this.getUser.bind(this));
    this.router.patch("/me", validateRequest(UsersUpdateDTO), this.updateUser.bind(this));
  }

  private async updateUser(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const updatedUser = await this.service.updateUser(user_id, req.validated);

    return res.status(200).json({
      success: true,
      user: updatedUser
    });
  }

  private async me(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const user: UserResponseDTO = await this.service.getUser(user_id);

    return res.status(200).json({
      success: true,
      user: user
    });
  }

  private async getUser(req: Request, res: Response) {
    const user_id = Number(req.params.user_id);
    const user: UserResponseDTO = await this.service.getUser(user_id);

    return res.status(200).json({
      success: true,
      user: user
    });
  }

  private async getUsers(req: Request, res: Response) {
    const user_id = getAuthenticatedUserId(req);
    const data = await this.service.getUsers(user_id, req.validated);

    return res.status(200).json({
      success: true,
      data
    });
  }
}

export default new UserController().router;
