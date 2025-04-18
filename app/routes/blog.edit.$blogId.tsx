import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import PreviewHTML from "~/components/previewHTML";
import BlogCreateForm from "~/components/blog-create-form";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getUserFromSession } from "~/services/session.server";
import { createBlog, getBlogById } from "~/db.server";
import { blogSchema, BlogSchema } from "utils/blog.schema";
import { useLoaderData } from "@remix-run/react";
import { BlogUpdateForm } from "~/components/blog-update-form";
import { useBlogContentStore } from "utils/store";
import { Tag } from "utils/types";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const userId = await getUserFromSession(request);
    if (!userId) throw Error("unauthorized");

    const body: BlogSchema = await request.json();
    if (!body) throw Error("invalid request body");

    const response = await createBlog({ ...body, userId: userId });

    return Response.json(
      {
        message: response.message,
        status: response.status,
        blog: response.blog,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ message: error.message }, { status: 400 });
    return Response.json({ message: "something went wrong" }, { status: 500 });
  }
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await getUserFromSession(request);
  if (!userId) throw redirect("/login");

  const { blogId } = params;
  if (!blogId) throw redirect("/");

  const blog = await getBlogById(blogId);

  return Response.json({ blog: blog.blog, success: blog.success });
};

const EditBlog = () => {
  const [isPreview, setIsPreview] = useState(false);
  const { blog, success } = useLoaderData<typeof loader>();
  const { content, setContent, clearContent } = useBlogContentStore();

  if (!success)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Seems like there was an issue with fetching the blog
      </div>
    );

  useEffect(() => {
    setContent({
      title: blog.title,
      body: blog.body,
      coverImage: blog.coverImage,
      tags: blog.tags.map((tag: Tag) => tag.tag.name).join(","),
    });
  }, [blog]);
  return (
    <div className="w-full h-full px-10 pb-10">
      <div className="pt-10 px-10 flex justify-between items-center">
        <p className="text-lg font-medium">Edit Post</p>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPreview(false)}
            variant={!isPreview ? "secondary" : "ghost"}
          >
            Editor
          </Button>
          <Button
            onClick={() => setIsPreview(true)}
            variant={isPreview ? "secondary" : "ghost"}
          >
            Preview
          </Button>
        </div>
      </div>

      {isPreview ? <PreviewHTML /> : <BlogUpdateForm blog={blog} />}
    </div>
  );
};

export default EditBlog;
