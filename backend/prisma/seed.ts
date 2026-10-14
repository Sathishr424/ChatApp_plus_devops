import "dotenv/config";
import { prisma } from '../shared/config/database/PrismaClient';
import bcrypt from "bcrypt";
import { faker } from '@faker-js/faker';
import { User } from "../shared/models/User"

async function main() {
  const password = await bcrypt.hash("sathish77", 10);
  const users = [];
  const cnt = 100;

  users.push({
    email: "sat1@gmail.com", username: "sat1", password
  })

  users.push({
    email: "sat2@gmail.com", username: "sat2", password
  })

  const user1: User = await prisma.users.upsert({
    where: {
      email: users[0].email,
    },
    create: users[0],
    update: {},
  });

  const user2: User = await prisma.users.upsert({
    where: {
      email: users[0].email,
    },
    create: users[0],
    update: {},
  });

  // for (let i = 0; i < cnt; i++) {
  //   const randomUsername = faker.internet.username();
  //   const randomEmail = faker.internet.email();
  //
  //   users.push({ email: randomEmail, username: randomUsername, password });
  // }

  const createdUsers: User[] = await Promise.all(
    users.map((user) =>
      prisma.users.upsert({
        where: {
          email: user.email,
        },
        create: user,
        update: {},
      })
    )
  );

  // const conversations: { message: string, from_id: number, to_id: number }[] = [];
  //
  // conversations.push({
  //   message: "Hey",
  //   from_id: user1.id,
  //   to_id: user2.id,
  // });
  //
  // createdUsers.forEach(user => {
  //   conversations.push({
  //     message: "Hey",
  //     from_id: user1.id,
  //     to_id: user.id
  //   });
  // });
  //
  // const createdConversations = [];
  //
  // for (const conversation of conversations) {
  //   const created = await prisma.conversation.create({
  //     data: conversation,
  //   });
  //
  //   createdConversations.push(created);
  // }
  //
  // await prisma.not_seen_message.createMany({
  //   data: [
  //     ...createdConversations.map(conv => {
  //       return {
  //         message_id: conv.id,
  //         from_id: conv.from_id,
  //         to_id: conv.to_id
  //       }
  //     }),
  //     ...createdConversations.map(conv => {
  //       return {
  //         message_id: conv.id,
  //         to_id: conv.from_id,
  //         from_id: conv.to_id
  //       }
  //     })
  //   ],
  //   skipDuplicates: true
  // })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
