# How does user send and receive message via socket?
1. When user first connect to socket, then initially join to their own room like if the user id is 2 then he will join the room "user:2". Then whenever some user send a message to the user with id 2 then when the new message request reach the socket it will emit a event only to the room with "user:2", since the user with id 2 joined this room he will receive the data with the message and which user send them this message.

# How are you tracking the user typing indication
1. When user starts typing on the chat window with that user id 2, we emit the "typing" with the user id 2 to the socket, then when it reaches the socket we'll only send it to the room with "user:id". So the user who joined that room will receive the "typing" with information of who typing.


# How are you  tracking who's online
1. When user initially comes online he emit a "online:${user_id}" and whoever joined that room will know that the user_id comes online. To know which users comes online users first need to join the room "online:${user_id of the user they are chatting with or they are visible in their sidebar"} we do this initially and whenever the sidebar view changes.
2. Plan is to store the status to redis when user connects initially and update the cache on periodically and when user disconnects.
3. Also we are storing the last_seen on whenever user comes online and goes offline (via socket connect and disconnect)
4. We gonna use db + redis for online statuses.

# Message read documentation
1. Initially when we fetch the users via API, the users will have unread_count and last_message fields.
2. Later when we select a user from the sidebar that means it will open in the message tab that also mean we read all the messages that user ever sent to us. So we mark all the messages as seen.
3. When we receive a new message from any of the user via socket, we have to update the user unread_count and last_message that we are doing it.
4. When we receive a message from the user we currently chatting in the message tab that means we just read/seen the new message they just sent to us so we mark that message as seen.

# Socket events we are sending
1. new_message event
2. typing event
3. online
4. join_online_room

# Socket events we are receiving
1. online:initial
2. typing to specific rooms
3. new_message to specific rooms
4. online to specific rooms



