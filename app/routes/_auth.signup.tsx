import { ActionFunctionArgs, data, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Form as RForm,
  useActionData,
  redirect,
  useNavigate,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupSchema } from "utils/user.schema";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "~/components/input-field";
import { Button } from "~/components/ui/button";
import { signup } from "~/db.server";
import { useState } from "react";
import {
  getUserFromSession,
  getUserSession,
  sessionStorage,
} from "~/services/session.server";

const signupFields = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    type: "text",
  },
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    type: "password",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserFromSession(request);
  if (userId) throw redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  type SignupSchema = z.infer<typeof signupSchema>;
  try {
    const body: SignupSchema = signupSchema.parse(await request.json());

    const user = await signup(body);
    if (!user?.id) {
      return Response.json(
        { success: false, message: "Something went wrong" },
        { status: 500 }
      );
    }

    const session = await getUserSession(request);
    session.set("user", user);

    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 }
    );
  }
}

export default function Signup() {
  const navigator = useNavigate();
  const actionData = useActionData<{ error?: Error | string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/signup", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        toast("signup successfull");
        navigator("/");
      }
    } catch (error) {
      if (error instanceof Error) toast(error.message);
      toast("signup failed, try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (actionData?.error) {
    if (actionData.error instanceof Error) toast(actionData.error.message);
    else toast(actionData.error);
  }

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center ">
      <div className="w-full flex flex-col gap-2 items-center select-none">
        <h3 className="text-3xl font-bold ">Create your account</h3>
        <p className="text-sm ">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <Form {...form}>
        <RForm
          onSubmit={form.handleSubmit(onsubmit)}
          className="flex flex-col gap-3 w-full"
        >
          {signupFields.map((item) => (
            <InputField
              key={item.label}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              label={item.label}
              control={form.control}
            />
          ))}
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </RForm>
      </Form>
    </div>
  );
}
