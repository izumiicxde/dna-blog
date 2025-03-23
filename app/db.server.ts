import { PrismaClient, User } from "@prisma/client";
import { compareHash, hashPassword } from "utils/password";
import { loginSchema, signupSchema } from "utils/user.schema";
import { z } from "zod";

declare global {
  var __prisma: PrismaClient;
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
global.__prisma.$connect();
export const prisma = global.__prisma;

export const signup = async (req: z.infer<typeof signupSchema>) => {
  const { success, data, error } = signupSchema.safeParse(req);
  console.log({ success, data, error });

  if (!success) throw new Error(JSON.stringify(error.flatten().fieldErrors));

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  console.log({ user });
  if (user !== null) {
    if (user.email === data.email)
      throw new Error("user with this email already exists");
    if (user.username === data.username)
      throw new Error("Username already taken");
  }

  const hash = await hashPassword(data.password);

  const { password, ...created } = await prisma.user.create({
    data: {
      email: data.email,
      password: hash,
      username: data.username,
      fullName: data.fullName,
    },
  });

  return created;
};

export type Credentials = {
  identifier: string;
  password: string;
};

export const login = async ({
  identifier,
  password,
}: Credentials): Promise<User | null> => {
  console.log({ identifier, password });
  const result = loginSchema.safeParse({ identifier, password });

  if (!result.success)
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
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
