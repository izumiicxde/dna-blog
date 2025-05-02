import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MoreVertical } from "lucide-react";
import { useUserStore } from "utils/store";
import { DisplayBlog } from "utils/types";
import { BlogActions } from "~/components/blog-actions";
import {
  deleteBlogPost,
  getBlogBySlug,
  likeUnlikeBlogPost,
  saveUnsaveBlogPost,
} from "~/db.server";
import { dateToWords } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const slug = params.slug;
    if (!slug) throw Error("slug not found");

    const blog = await getBlogBySlug(slug);
    return Response.json({
      success: blog.success,
      message: blog.success ? "fetch successfull" : "fetch failed",
      blog: blog.blog,
    });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ success: false, message: error.message });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "DELETE") {
    const { blogId } = await request.json();
    if (!blogId) throw Error("invalid blog id");

    const response = await deleteBlogPost(blogId);
    if (response.status)
      return Response.json(
        { message: "blog deleted successfully" },
        { status: 200 }
      );
    else
      return Response.json(
        { message: "failed to delete blog" },
        { status: 500 }
      );
  } else if (request.method === "POST") {
    const { blogId, userId, intent } = await request.json();
    if (intent === "like") {
      const response = await likeUnlikeBlogPost(userId, blogId);
      return Response.json({ status: response.status });
    } else if (intent === "save") {
      const response = await saveUnsaveBlogPost(userId, blogId);
      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}

const BlogDisplayPage = () => {
  type LoaderResponse = {
    success: boolean;
    blog: DisplayBlog;
    message: string;
  };
  const { user } = useUserStore();

  const { success, blog, message }: LoaderResponse =
    useLoaderData<typeof loader>();

  if (!success)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <>
      <div className="lg:p-60 md:p-28 p-10 md:pt-5 lg:pt-5">
        <div className="flex items-center justify-center  gap-1 select-none">
          {blog.user.image ? (
            <img src={blog.user.image} className="size-8 rounded-full" />
          ) : (
            <div className="size-8 rounded-full bg-black" />
          )}
          <div className="flex flex-col justify-center items-start text-md w-full ">
            <p>{blog.user.username}</p>
            <p className="text-xs flex gap-2 justify-between w-full">
              <span>{blog.user.fullName}</span>
              <span className="flex gap-3">
                <span>
                  Posted on {dateToWords(blog.createdAt.split("T")[0])}
                </span>
                {user?.id === blog.user.id && (
                  <BlogActions blogId={blog.id} slug={blog.slug}>
                    <MoreVertical className="size-4" />
                  </BlogActions>
                )}
              </span>
            </p>
          </div>
        </div>

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto max-h-80 object-cover object-center rounded-sm mt-5"
          />
        )}
        <h2 className="text-5xl font-black pt-10 break-words max-w-full">
          {blog?.title}
        </h2>

        <p className="flex gap-1.5 text-xs pt-2.5 select-none">
          {blog.tags &&
            blog.tags.map((tag) => (
              <span key={tag.tag.name}>{tag.tag.name}</span>
            ))}
        </p>

        <div
          className="prose-sm w-full content-preview pt-10 break-words max-w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </div>
    </>
  );
};

export default BlogDisplayPage;
