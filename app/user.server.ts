import { prisma } from "./db.server";

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return { status: false, user: null };
  return { status: true, user };
};

export const updateUserAvatar = async ({
  userId,
  url,
}: {
  userId: string;
  url: string;
}) => {
  await prisma.user.update({
    where: { id: userId },
    data: { image: url },
  });
};
