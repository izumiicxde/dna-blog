import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { login } from "~/db.server";
import { User } from "@prisma/client";

export type Credentials = {
  email: string;
  username?: string;
  password: string;
};

export const authenticator = new Authenticator<User | null>();

authenticator.use(
  new FormStrategy(async ({ form }: { form: FormData }) => {
    const identifier = form.get("identifier") as string;
    const password = form.get("password") as string;

    const user = await login({ identifier, password });
    return user;
  }),
  "use-auth"
);
