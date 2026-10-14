import "dotenv/config";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";
import { prisma } from '../shared/config/database/PrismaClient';

const createUser = async (username: string, password: string, email: string) => {
  try {
    try {
      try {
        await prisma.users.findFirstOrThrow({ where: { email } });
        console.log('USER_EMAIL_ALREADY_EXISTS')
        return false;
      } catch (err) {
        await prisma.users.findFirstOrThrow({ where: { username } });
        console.log('USERNAME_ALREADY_IN_USE')
        return false;
      }

    } catch (err) {
      await prisma.users.create({
        data: {
          email,
          password,
          username,
        }
      })

      return true
    }
  } catch (error) {
    console.error('Error parsing JSON body:', error);
    return false;
  }
}

export async function generate() {
  const password = await bcrypt.hash("sathish77", 10);
  let cnt = 100;
  const arr = Array(cnt).fill(0);
  await Promise.all(arr.map(async () => {
    const randomUsername = faker.internet.username();
    const randomEmail = faker.internet.email();

    await createUser(randomUsername, password, randomEmail);
    console.log("User created");
  }))
  console.log("All users created");
}

generate();
