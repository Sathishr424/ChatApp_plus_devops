import cors from "cors";
import express, { Request, Response } from "express";
import AuthController from "../shared/controllers/AuthController";
import ConversationController from "../shared/controllers/ConversationController";
import GroupChatController from "../shared/controllers/GroupChatController";
import GroupController from "../shared/controllers/GroupController";
import OneToOneChatController from "../shared/controllers/OneToOneChatController";
import UserController from "../shared/controllers/UserController";
import { ErrorHandler } from "../shared/exceptions/ErrorHandler";
import { AuthMiddleware } from "../shared/middlewares/AuthMiddleware";
import HealthController from "../shared/controllers/HealthController";

const allowedOrigins = [
  process.env.CLIENT_URL ?? "http:/localhost:5173"
] // Example: your Angular or React dev server

const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", HealthController);

app.use("/auth", AuthController);
app.use("/users", AuthMiddleware, UserController);
app.use("/groups", AuthMiddleware, GroupController);

app.use("/conversations", AuthMiddleware, ConversationController);

app.use("/conversations/one-to-one", AuthMiddleware, OneToOneChatController);
app.use("/conversations/groups", AuthMiddleware, GroupChatController);


app.get("/", (_: Request, res: Response) => {
    res.send("Hello world!")
});

app.use(ErrorHandler);

export default app;
