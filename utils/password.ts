import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salts = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salts);
  return hash;
};

export const compareHash = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) => {
  return await bcrypt.compare(password, hash);
};
