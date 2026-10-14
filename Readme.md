Real-Time Chat Platform

A simplified Slack/Discord.

Features

User authentication
1-to-1 chat
Group channels
Online/offline status
Typing indicators
Message history
Message search
Notifications

System design: API → WebSocket servers → Redis Pub/Sub → PostgreSQL

Interesting problems: WebSocket scaling, message ordering, connection management, presence, horizontal scaling.
