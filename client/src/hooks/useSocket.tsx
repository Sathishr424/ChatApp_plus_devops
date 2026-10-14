import type { DeleteMessageSocket, EditMessageSocket, JoinRoomSocket, MessagesSeenSocket, SentMessageSocket, TypingSocket } from "@/dto/DTOs";
import { SubscriptionType, type SocketProps } from "@/interfaces";
import ConfigService from "@/services/ConfigService";
import MessageSystem from "@/utils/MessageSystem";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [usersOnline, setUsersOnline] = useState<Set<number>>(new Set());
  const [usersLastSeen, setUsersLastSeen] = useState<Map<number, Date>>(new Map());

  useEffect(() => {
    const unSubscribeOnline = MessageSystem.subscribe(SubscriptionType.ONLINE, ({ user_id, status }) => {
      setUsersOnline(prev => {
        const next = new Set(prev);

        if (status) {
          next.add(user_id);
        } else {
          next.delete(user_id);
        }

        return next;
      });

      setUsersLastSeen(prev => {
        const next = new Map(prev);
        next.set(user_id, new Date);
        return next;
      });
    });

    return unSubscribeOnline;
  }, [])

  const emitGroupActivity = useCallback((data: { group_id: number, members: number[] }) => {
    socketRef.current?.emit("group_activity", data);
  }, []);

  const emitJoinRooms = useCallback((data: JoinRoomSocket) => {
    socketRef.current?.emit("join_online_room", data);
  }, []);

  const emitTyping = useCallback((data: TypingSocket) => {
    socketRef.current?.emit("typing", data);
  }, [])

  const emitSendMessage = useCallback((sendData: SentMessageSocket) => {
    socketRef.current?.emit("send_message", sendData);
  }, [])

  const emitDeleteMessage = useCallback((data: DeleteMessageSocket) => {
    if (!confirm("Do you really want to delete this message?")) return;

    socketRef.current?.emit("delete_message", data);
  }, []);

  const emitMessagesSeen = useCallback((data: MessagesSeenSocket) => {
    socketRef.current?.emit("messages_seen", data);
  }, []);

  const emitEditMessage = useCallback((data: EditMessageSocket) => {
    socketRef.current?.emit("edit_message", data);
  }, []);

  const initializeSocket = useCallback((user_id: number, authToken: string) => {
    console.log("Intializing socket");
    const socket = io(ConfigService.getSocketURL(), {
      auth: {
        userId: user_id,
        token: authToken
      }
    });
    socketRef.current = socket;

    // Emiting that we are online
    socket.emit("online");

    // This for pinging the server that we are online on every 30 seconds
    const onlineHandler = setInterval(() => {
      socket.emit("online");
    }, 30 * 1000 /* 30 seconds */)

    const handleInitialOnline = ({ usersOnline }: { usersOnline: number[] }) => {
      setUsersOnline(prev => {
        const next = new Set(prev);
        usersOnline.forEach(user_id => {
          next.add(user_id);
        });
        return next;
      })
      
      setUsersLastSeen(prev => {
        const next = new Map(prev);
        usersOnline.forEach(user_id => {
          next.set(user_id, new Date());
        });
        return next;
      });
      socket.off("online:initial", handleInitialOnline);
    }

    // It will return the currently online users at the moment we register ourself as online
    socket.on("online:initial", handleInitialOnline);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("connect_error", (error) => {
      console.error(error);
      console.log("Socket connection error:", error);
    });

    MessageSystem.setupSocketListener(socket);

    // Adding ourself as online
    setUsersOnline(prev => {
      const next = new Set(prev);
      next.add(user_id);
      return next;
    });

    setUsersLastSeen(prev => {
      const next = new Map(prev);
      next.set(user_id, new Date());
      return next;
    });

    return () => {
      clearInterval(onlineHandler);
      socket.off("online:initial", handleInitialOnline);
      socket.disconnect();
      socketRef.current = null;
    }
  }, [])

  return {
    emitTyping,
    emitSendMessage,
    emitEditMessage,
    emitDeleteMessage,
    emitMessagesSeen,
    initializeSocket,
    usersOnline,
    usersLastSeen,
    socketRef,
    emitJoinRooms,
    emitGroupActivity
  } as SocketProps
}
