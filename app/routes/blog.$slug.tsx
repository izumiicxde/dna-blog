import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getBlogBySlug } from "~/db.server";

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
const BlogDisplayPage = () => {
  const { success, blog, message } = useLoaderData<typeof loader>();

  return <div>{message}</div>;
};

export default BlogDisplayPage;
