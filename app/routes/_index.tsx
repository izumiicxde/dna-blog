import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DisplayBlog } from "utils/types";
import BlogCard from "~/components/blog-card";
import IndexSidebar from "~/components/index-sidebar";
import { getBlogs } from "~/db.server";
import { getUserFromSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "DNA Blog" },
    { name: "description", content: "Welcome to dna blog" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const userId = await getUserFromSession(request);
    const { blogs, currentPage, total, totalPages } = await getBlogs();

    return Response.json(
      {
        blogs,
        currentPage,
        total,
        totalPages,
        success: userId ?? false,
      },
      { status: userId ? 200 : 400 }
    );
  } catch (error) {
    return Response.json(
      {
        success:
          error instanceof Error ? error.message : "something went wrong",
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
};

export default function Index() {
  const {
    success: authenticated,
    blogs,
    total,
    totalPages,
    currentPage,
  } = useLoaderData<typeof loader>();

  return (
    <div className="w-screen overflow-x-hidden h-auto flex gap-2 items-start px-2 py-10  lg:pr-40 ">
      <div className="w-60 hidden lg:flex flex-col py-5 ">
        <IndexSidebar authenticated={authenticated} />
      </div>
      <div className="w-full lg:w-full h-auto flex flex-col gap-4 items-start lg:pl-10">
        <h3 className="text-xl font-bold">For you</h3>
        {blogs.length === 0 ? (
          <p className="text-sm w-full h-[60vh] flex justify-center items-center text-gray-400">
            No blogs to display
          </p>
        ) : (
          <>
            {blogs?.map((blog: DisplayBlog) => (
              <BlogCard blog={blog} key={`${blog.title} + ${blog.createdAt}`} />
            ))}
            <p className="text-xs w-full flex justify-center items-center text-gray-400 select-none">
              The End.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
