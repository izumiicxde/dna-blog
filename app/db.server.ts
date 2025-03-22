import { PrismaClient, User } from "@prisma/client";
import { compareHash } from "utils/password";
import { signupSchema } from "utils/user.schema";

declare global {
  var __prisma: PrismaClient;
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
global.__prisma.$connect();
export const prisma = global.__prisma;

export type Credentials = {
  email: string;
  username?: string;
  password: string;
};

export const signup = async (data: User) => {
  const result = signupSchema.safeParse(data);
  if (!result.success)
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));

  return prisma.user.create({
    data: result.data,
  });
};

export const login = async ({
  email,
  password,
  username,
}: Credentials): Promise<User | null> => {
  if ((!email || email.length < 0) && (!username || username.length < 0))
    return null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (!user) throw new Error("invalid credentials");
  const isPasswordCorrect = await compareHash({
    hash: user.password,
    password,
  });
  if (!isPasswordCorrect) return null;
  return user;
};
