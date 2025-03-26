import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { blogs } from "utils/dummy";
import BlogCard from "~/components/blog-card";
import IndexSidebar from "~/components/index-sidebar";
import { getUserFromSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "DNA Blog" },
    { name: "description", content: "Welcome to dna blog" },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserFromSession(request);
  return Response.json(
    { success: userId ?? false },
    { status: userId ? 200 : 400 }
  );
};

export default function Index() {
  const { success: authenticated } = useLoaderData<typeof loader>();

  return (
    <div className="w-screen overflow-x-hidden h-auto flex gap-2 items-start px-2 py-10">
      <div className="w-60 hidden lg:flex flex-col py-10 ">
        <IndexSidebar authenticated={authenticated} />
      </div>
      <div className="w-full lg:w-full  h-full min-h-screen flex flex-col gap-4 pt-4 items-center">
        {blogs?.map((blog) => (
          <BlogCard item={blog} key={`${blog.title} + ${blog.hashtag}`} />
        ))}
      </div>
    </div>
  );
}
