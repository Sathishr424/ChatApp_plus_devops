import { Router, Request, Response } from "express"
import { validateRequest } from "../utils/ValidateRequest";
import { LoginUserDTO } from "../dto/request/LoginUserDTO";
import { RegisterUserDTO } from "../dto/request/RegisterUserDTO";
import AuthService from "../services/AuthService";

class AuthController {
  public router: Router = Router();
  private service = AuthService;

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    this.router.post("/login", validateRequest(LoginUserDTO), this.login.bind(this));
    this.router.post("/register", validateRequest(RegisterUserDTO), this.register.bind(this));
    this.router.post("/logout", this.logout.bind(this));
  }

  private async login(req: Request, res: Response) {
    const token = await this.service.login(req.validated);

    return res.status(200).json({
      success: true,
      token: token
    });
  }

  private async register(req: Request, res: Response) {
    await this.service.register(req.validated);

    return res.status(200).json({
      success: true,
    });
  }

  private logout(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
    });
  }
}

export default new AuthController().router;
