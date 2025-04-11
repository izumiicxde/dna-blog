import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "~/db.server";
import { getUserFromSession } from "~/services/session.server";
import { updateUserAvatar } from "~/user.server";

type RequestJSON = {
  url: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const userId = await getUserFromSession(request);
    if (!userId) throw Error("unauthorized");

    const data: RequestJSON = await request.json();

    if (!data.url) throw Error("invalid avatar url");

    await updateUserAvatar({ userId, url: data.url });
    return Response.json({
      message: "updated image",
      success: true,
    });
  } catch (error) {
    return Response.json({
      message: error instanceof Error ? error.message : "something went wrong",
      success: false,
    });
  }
};
