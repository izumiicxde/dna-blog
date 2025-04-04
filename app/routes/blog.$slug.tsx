import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DisplayBlog, LikeBlogRequest } from "utils/types";
import { getBlogBySlug, likeBlogPost } from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
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
  const req: LikeBlogRequest = await request.json();
  if (!req)
    return Response.json({ message: "invalid request" }, { status: 400 });

  const res = await likeBlogPost(req);
}

const BlogDisplayPage = () => {
  type LoaderResponse = {
    success: boolean;
    blog: DisplayBlog;
    message: string;
  };

  const { success, blog, message }: LoaderResponse =
    useLoaderData<typeof loader>();
  if (!success)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="p-20 pt-5">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-auto max-h-80 object-cover object-center rounded-sm"
        />
      )}
      {/* <p className="text-xs pt-4 ">{blog.tags[0].tag.name.split(",")}</p> */}
      <h2 className="text-5xl font-black pt-10">{blog?.title}</h2>
      <div
        className="prose-sm w-full content-preview  pt-10"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      ></div>
    </div>
  );
};

export default BlogDisplayPage;
