import type { Socket } from "socket.io-client";
import type { Message } from "@/types/Message";
import { SubscriptionType, type DeleteMessageSocketResponse, type DeleteMessageSubscriptionCallback, type EditMessageSubscriptionCallback, type MessagesSeenSocketResponse, type MessagesSeenSubscriptionCallback, type MessageSubscriptionCallback, type OnlineSubscriptionCallback, type Subscriber, type SubscriptionOnlineSocketResponse, type SubscriptionTypingSocketResponse, type TypingSubscriptionCallback } from "../interfaces";

class SubscriptionSystem<ResponseType, CallbackType extends (data: ResponseType) => void> {
  private subscribers: Subscriber<CallbackType>[] = [];
  private lastId = 0;

  public subscribe(callback: CallbackType) {
    this.lastId += 1;
    const id = this.lastId;
    this.subscribers.push({ id, callback });
    return () => {
      this.unsubscribe(id);
    }
  }

  public unsubscribe(id: number) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber.id !== id);
  }

  public notify(data: ResponseType) {
    this.subscribers.forEach(sub => sub.callback(data));
  }
}

class MessageSystem {
  private socket?: Socket;
  private editMessageSubscription: SubscriptionSystem<Message, EditMessageSubscriptionCallback> = new SubscriptionSystem();
  private messageSubscription: SubscriptionSystem<Message, MessageSubscriptionCallback> = new SubscriptionSystem();
  private deleteMessageSubscription: SubscriptionSystem<DeleteMessageSocketResponse, DeleteMessageSubscriptionCallback> = new SubscriptionSystem();
  private messagesSeenSubscription: SubscriptionSystem<MessagesSeenSocketResponse, MessagesSeenSubscriptionCallback> = new SubscriptionSystem();
  private typingSubscription: SubscriptionSystem<SubscriptionTypingSocketResponse, TypingSubscriptionCallback> = new SubscriptionSystem();
  private onlineSubscription: SubscriptionSystem<SubscriptionOnlineSocketResponse, OnlineSubscriptionCallback> = new SubscriptionSystem();

  public subscribe(
    subType: typeof SubscriptionType.MESSAGE,
    callback: MessageSubscriptionCallback
  ): () => void;

  public subscribe(
    subType: typeof SubscriptionType.EDIT_MESSAGE,
    callback: EditMessageSubscriptionCallback
  ): () => void;

  public subscribe(
    subType: typeof SubscriptionType.DELETE_MESSAGE,
    callback: DeleteMessageSubscriptionCallback
  ): () => void;

  public subscribe(
    subType: typeof SubscriptionType.MESSAGES_SEEN,
    callback: MessagesSeenSubscriptionCallback
  ): () => void;

  public subscribe(
    subType: typeof SubscriptionType.TYPING,
    callback: TypingSubscriptionCallback
  ): () => void;

  public subscribe(
    subType: typeof SubscriptionType.ONLINE,
    callback: OnlineSubscriptionCallback
  ): () => void;

  public subscribe(subType: SubscriptionType, callback: MessageSubscriptionCallback | TypingSubscriptionCallback | OnlineSubscriptionCallback | DeleteMessageSubscriptionCallback) {
    switch (subType) {
      case SubscriptionType.MESSAGE:
        return this.messageSubscription.subscribe(callback as MessageSubscriptionCallback);
      case SubscriptionType.EDIT_MESSAGE:
        return this.editMessageSubscription.subscribe(callback as EditMessageSubscriptionCallback);
      case SubscriptionType.MESSAGES_SEEN:
        return this.messagesSeenSubscription.subscribe(callback as MessagesSeenSubscriptionCallback);
      case SubscriptionType.DELETE_MESSAGE:
        return this.deleteMessageSubscription.subscribe(callback as DeleteMessageSubscriptionCallback);
      case SubscriptionType.TYPING:
        return this.typingSubscription.subscribe(callback as TypingSubscriptionCallback);
      case SubscriptionType.ONLINE:
        return this.onlineSubscription.subscribe(callback as OnlineSubscriptionCallback);
    }
  }

  public setupSocketListener(socket: Socket) {
    if (this.socket == socket) return;
    this.socket = socket;

    const messageHandler = (message: Message) => {
      this.messageSubscription.notify(message);
    };

    const editMessageHandler = (message: Message) => {
      this.editMessageSubscription.notify(message);
    };

    const deleteMessageHandler = (data: DeleteMessageSocketResponse) => {
      this.deleteMessageSubscription.notify(data);
    };

    const messagesSeenHandler = (data: MessagesSeenSocketResponse) => {
      this.messagesSeenSubscription.notify(data);
    };

    const typingHandler = (data: SubscriptionTypingSocketResponse) => {
      this.typingSubscription.notify(data);
    };

    const onlineHandler = (data: SubscriptionOnlineSocketResponse) => {
      this.onlineSubscription.notify(data);
    };

    socket.on("new_message", messageHandler);
    socket.on("edit_message", editMessageHandler);
    socket.on("delete_message", deleteMessageHandler);
    socket.on("messages_seen", messagesSeenHandler);
    socket.on("typing", typingHandler)
    socket.on("online", onlineHandler)

    return () => {
      socket.off("new_message", messageHandler);
      socket.off("edit_message", editMessageHandler);
      socket.off("delete_message", deleteMessageHandler);
      socket.off("messages_seen", messagesSeenHandler);
      socket.off("typing", typingHandler)
      socket.off("online", onlineHandler)

      if (this.socket == socket) this.socket = undefined;
    }
  }
}

export default new MessageSystem();
