import { LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "~/db.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await getUser(request);
    return Response.json(user);
  } catch (error) {
    return Response.json({
      message: error instanceof Error ? error.message : "something went wrong",
      success: false,
    });
  }
};
