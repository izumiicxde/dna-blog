import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect, useFetcher, useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema } from "utils/user.schema";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { authenticator } from "~/services/auth.server";
import {
  getUserFromSession,
  getUserSession,
  sessionStorage,
} from "~/services/session.server";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "~/components/input-field";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { login } from "~/db.server";

type ActionDataType = {
  success: boolean;
  message: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserFromSession(request);
  if (userId) throw redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  type LoginSchema = z.infer<typeof loginSchema>;
  try {
    const body: LoginSchema = await request.json();
    const user = await login(body);

    if (!user)
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const session = await getUserSession(request);
    session.set("user", user);

    return Response.json(
      {
        success: true,
        message: "Login successful",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default function Login() {
  const fetcher = useFetcher();
  const navigator = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(
    fetcher.state === "submitting"
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      fetcher.submit(values, {
        method: "POST",
        action: "/login",
        encType: "application/json",
      });
    } catch (error) {
      if (error instanceof Error) toast(error.message);
      else toast("login failed, try again later");
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as ActionDataType;
      if (data.success) {
        toast(data.message);
        navigator("/");
      } else {
        toast(data.message || "Login failed");
      }
    }
  }, [fetcher.data]);

  return (
    <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center ">
      <div className="w-full flex flex-col gap-2 items-center select-none">
        <h3 className="text-3xl font-bold ">Login to your account</h3>
        <p className="text-sm ">
          Don&apos;t have an account?{" "}
          <Link to={"/signup"} className="text-blue-600 hover:underline">
            Signup
          </Link>{" "}
        </p>
      </div>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onsubmit)}
          className="flex flex-col gap-3 w-full"
        >
          <InputField
            name="identifier"
            type="text"
            placeholder="enter email or username"
            label="Email or Username"
            control={form.control}
          />
          <InputField
            name="password"
            type="password"
            placeholder="enter password"
            label="Password"
            control={form.control}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </fetcher.Form>
      </Form>
    </div>
  );
}
