import "dotenv/config";
import "reflect-metadata";
import http from "node:http";
import { Server, Socket } from "socket.io";
import { client as redisClient } from "../../shared/config/redis/connection";
import { EditMessageRequestDTO } from "../../shared/dto/request/EditMessageRequestDTO";
import { MessageRequestDTO } from "../../shared/dto/request/MessageRequestDTO";
import { JoinRoomSocket, JwtPayload } from "../../shared/interfaces";
import GroupChatService from "../../shared/services/GroupChatService";
import JWTService from "../../shared/services/JWTService";
import OneToOneChatService from "../../shared/services/OneToOneChatService";
import UserService from "../../shared/services/UserService";
import { DeleteMessageDTO, EditMessageDTO, MessagesSeenDTO, SentMessageDTO } from "./dtos/SentMessageDTO";
import { HandleError } from "./utils/helper";
import GroupService from "../../shared/services/GroupService";
import { createAdapter } from "@socket.io/redis-adapter";
import { prisma } from "../../shared/config/database/PrismaClient";
import EmailService from "../../shared/services/EmailService";

function getUserRoom(userId: number) {
  return `user:${userId}`;
}

function getGroupRoom(userId: number) {
  return `group:${userId}`;
}

function getUserOnlineRoom(userId: number) {
  return `online:${userId}`;
}

async function joinAllGroups(socket: Socket, user_id: number) {
  const groups = await GroupService.getAllGroupIds(user_id);

  groups.forEach(group => {
    socket.join(getGroupRoom(group.id));
  });
}

const subClient = redisClient.duplicate();

const httpServer = http.createServer(async (req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      status: "ok",
    }));

    return;
  }

  if (req.url === "/ready" && req.method === "GET") {
    const checks = {
      database: false,
      redis: false,
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch { }

    try {
      await redisClient.ping();
      await subClient.ping();
      checks.redis = true;
    } catch { }

    const ready = checks.database && checks.redis;

    res.writeHead(ready ? 200 : 503, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      status: ready ? "ready" : "not_ready",
      checks,
    }));

    return;
  }

  res.writeHead(404);
  res.end();
});

async function isUserOnline(id: number) {
  const room = getUserOnlineRoom(id);
  const count = await redisClient.SCARD(room);
  return count > 0;
}

async function getUserSeasionCounts(id: number) {
  const room = getUserOnlineRoom(id);
  return await redisClient.SCARD(room);
}

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});


// middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = JWTService.verify(token);
    console.log("User connected with token:", user);
    socket.data.user = user;
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", async (socket) => {
  const user: JwtPayload = socket.data.user;
  const userOnlineRoom = getUserOnlineRoom(user.userId);

  socket.join(getUserRoom(user.userId))
  joinAllGroups(socket, user.userId);

  socket.on("join_online_room", async ({ ids }: { ids: JoinRoomSocket[] }) => {
    const usersOnline = new Set<number>();
    let user_exist = false;
    Promise.all(
      ids.map(async ({ id, is_group }) => {
        const room = is_group ? getGroupRoom(id) : getUserOnlineRoom(id);
        socket.join(room);
        const count = await redisClient.SCARD(room);

        if (!is_group && count > 0) {
          user_exist = true;
          usersOnline.add(id);
        }
      })
    ).then(() => {
      if (user_exist) socket.emit("online:initial", { usersOnline: [...usersOnline] })
    }).catch(err => {
      console.error(err)
    });
  })


  socket.on("online", async () => {
    await redisClient.SADD(userOnlineRoom, socket.id);
  })

  socket.on("typing", ({ to_id, is_group }: { to_id: number, is_group: boolean }) => {
    socket.to(is_group ? getGroupRoom(to_id) : getUserRoom(to_id)).emit("typing", {
      from_id: user.userId,
      group_id: is_group ? to_id : -1,
      is_group
    });
  })

  socket.on("messages_seen", async (data: MessagesSeenDTO) => {
    HandleError(async () => {
      if (data.is_group) {
        await GroupChatService.markSeen(user.userId, data.to_id);
        io.to(getGroupRoom(data.to_id)).emit("messages_seen", data);
      } else {
        await OneToOneChatService.markSeen(user.userId, data.to_id);
        io.to(getUserRoom(data.to_id)).emit("messages_seen", data);
      }
    })
  });

  socket.on("send_message", async (messageData: SentMessageDTO) => {
    HandleError(async () => {
      if (messageData.is_group) {
        const message = await GroupChatService.sentMessage(user.userId, messageData.to_id, MessageRequestDTO.build(messageData.message, messageData.reply_id, messageData.gif, messageData.files));
        io.to(getGroupRoom(messageData.to_id)).emit("new_message", message);

        EmailService.sendNewMessageNotificationGroup(user.userId, messageData.to_id, isUserOnline);
      } else {
        const message = await OneToOneChatService.sentMessage(user.userId, messageData.to_id, MessageRequestDTO.build(messageData.message, messageData.reply_id, messageData.gif, messageData.files));
        io.to(getUserRoom(messageData.to_id)).emit("new_message", message);
        socket.emit("new_message", message);

        EmailService.sendNewMessageNotificationOneToOne(user.userId, messageData.to_id, isUserOnline);
      }
    })
  });

  socket.on("edit_message", async (messageData: EditMessageDTO) => {
    HandleError(async () => {
      if (messageData.is_group) {
        const message = await GroupChatService.editMessage(user.userId, EditMessageRequestDTO.build(messageData.message, messageData.message_id));
        io.to(getGroupRoom(messageData.to_id)).emit("edit_message", message);
      } else {
        const message = await OneToOneChatService.editMessage(user.userId, EditMessageRequestDTO.build(messageData.message, messageData.message_id));
        io.to(getUserRoom(messageData.to_id)).emit("edit_message", message);
        socket.emit("edit_message", message);
      }
    })
  });

  socket.on("delete_message", async (deleteData: DeleteMessageDTO) => {
    HandleError(async () => {
      if (deleteData.is_group) {
        const success = await GroupChatService.deleteMessage(user.userId, deleteData.message_id);
        if (success) io.to(getGroupRoom(deleteData.to_id)).emit("delete_message", deleteData);
      } else {
        const success = await OneToOneChatService.deleteMessage(user.userId, deleteData.message_id);
        if (success) io.to(getUserRoom(deleteData.to_id)).emit("delete_message", deleteData);
        socket.emit("delete_message", deleteData);
      }
    })
  });

  socket.on("group_activity", async ({ group_id, members }: { group_id: number, members: number[] }) => {
    HandleError(async () => {
      const room = getGroupRoom(group_id);
      members.forEach(id => {
        io.in(getUserRoom(id)).socketsJoin(room);
      })
    })
  });

  socket.on("disconnect", async () => {
    await redisClient.SREM(userOnlineRoom, socket.id);

    const count = await getUserSeasionCounts(user.userId);

    if (count === 0) {
      io.to(userOnlineRoom).emit("online", {
        user_id: user.userId,
        status: false
      });
      await UserService.updateLastSeen(user.userId);
    }
    console.log(`Client disconnected: ${socket.id}, clients remaining sessions:`, count);
  });

  await redisClient.SADD(userOnlineRoom, socket.id);

  io.to(userOnlineRoom).emit("online", {
    user_id: user.userId,
    status: true
  });

  const count = await getUserSeasionCounts(user.userId);
  console.log(`Client connected: ${socket.id} active seasions: ${count}`);
});

async function start() {
  await Promise.all([
    redisClient.connect(),
    subClient.connect(),
  ]);

  io.adapter(createAdapter(redisClient, subClient));

  httpServer.listen(5002, () => {
    console.log("Socket server listening on 5002");
  });
}

start().catch((error) => {
  console.error("Failed to start socket server:", error);
  process.exit(1);
});
