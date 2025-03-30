import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";
import { getUserFromSession } from "~/services/session.server";

const f = createUploadthing();

const auth = async (args: ActionFunctionArgs) => {
  const userId = await getUserFromSession(args.request);
  if (!userId) return false;
  return userId;
};

const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ event }) => {
      const userId = await auth(event);
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl }; // sent to client
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export const { action, loader } = createRouteHandler({
  router: uploadRouter,
});
