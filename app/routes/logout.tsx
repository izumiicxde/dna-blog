import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(request), // Ensures session is cleared
      },
    });
  } catch (error) {
    throw new Error("Unable to logout");
  }
};
