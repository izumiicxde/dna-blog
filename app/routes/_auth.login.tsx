import { ActionFunctionArgs } from "@remix-run/node";
import {
  Link,
  Form as RForm,
  redirect,
  useFetcher,
  useNavigate,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema } from "utils/user.schema";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { authenticator } from "~/services/auth.server";
import { getUserSession, sessionStorage } from "~/services/session.server";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "~/components/input-field";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { login } from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  type LoginSchema = z.infer<typeof loginSchema>;
  try {
    const body: LoginSchema = await request.json();
    const user = await login(body);

    if (!user)
      return Response.json({ error: "Invalid credentials" }, { status: 400 });

    const session = await getUserSession(request);
    session.set("user", user);

    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error: "login failed." }, { status: 500 });
  }
}

export default function Login() {
  const navigator = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.redirected) {
        navigator("/");
        return;
      }
      if (response.ok) {
        toast("Login successful");
      } else {
        const data = await response.json();
        console.log(data);

        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      if (error instanceof Error) toast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <RForm
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
        </RForm>
      </Form>
    </div>
  );
}
