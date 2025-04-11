import { prisma } from "./db.server";

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
