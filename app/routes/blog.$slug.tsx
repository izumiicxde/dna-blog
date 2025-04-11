import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Heart } from "lucide-react";
import { DisplayBlog, LikeBlogRequest } from "utils/types";
import { getBlogBySlug, likeBlogPost } from "~/db.server";
import { dateToWords } from "~/lib/utils";

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
              <span>Posted on {dateToWords(blog.createdAt.split("T")[0])}</span>
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
        <h2 className="text-5xl font-black pt-10">{blog?.title}</h2>
        <p className="flex gap-1.5 text-xs pt-2.5 select-none">
          {blog.tags && blog.tags.map((tag) => <span>{tag.tag.name}</span>)}
        </p>

        <div
          className=" prose-sm w-full content-preview  pt-10"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        ></div>
      </div>
    </>
  );
};

export default BlogDisplayPage;
