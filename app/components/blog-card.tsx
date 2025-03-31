import { Bookmark, LucideBugOff, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";
import { Blog } from "@prisma/client";
import { DisplayBlog } from "utils/types";

type BlogCardContent = {
  item: {
    author: string;
    team: string;
    date: string;
    title: string;
    hashtag: string;
    reactions: number;
    comments: number;
    read_time: string;
    url?: string;
  };
};
const BlogCard = ({ blog }: { blog: DisplayBlog }) => {
  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          {blog.user.image ? (
            <img
              src={blog.user.image}
              alt={blog.user.fullName}
              className="w-10 h-10 rounded-full "
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black" />
          )}
          <div className="">
            <p className="text-sm">{blog.user.username}</p>
            <p className="text-xs">{blog.user.fullName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="group">
        <Link to={`/blog/${blog.title.split(" ").join("_")}`}>
          <h2 className="text-4xl font-black group-hover:text-blue-900">
            {blog.title}
          </h2>
        </Link>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default BlogCard;
