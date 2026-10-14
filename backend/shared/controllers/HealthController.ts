import { Request, Response, Router } from "express";
import { prisma } from "../config/database/PrismaClient";

class HealthController {
  public router: Router = Router();

  constructor() {
    this.initilaizeRoutes();
  }

  private initilaizeRoutes() {
    this.router.get("/ready", this.ready.bind(this));
    this.router.get("/health", this.health.bind(this));
  }

  private async health(_: Request, res: Response) {
    return res.status(200).json({
      status: "ok",
    });
  }

  private async ready(_: Request, res: Response) {
    const checks = {
      database: false,
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch { }

    const ready = checks.database;

    return res.status(ready ? 200 : 503).json({
      status: ready ? "ready" : "not_ready",
      checks,
    });
  }
}

export default new HealthController().router;
