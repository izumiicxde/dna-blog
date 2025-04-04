import { Bookmark, Heart, LucideBugOff, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";
import { Blog } from "@prisma/client";
import { DisplayBlog } from "utils/types";
import { dateToWords } from "~/lib/utils";
import { blogs } from "utils/dummy";
import { useEffect, useState } from "react";

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
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = async () => {};

  return (
    <Card className="w-full shadow-none rounded-none border-0 border-b-2 border-b-black/5">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 ">
          {blog.user.image ? (
            <img
              src={blog.user.image}
              alt={blog.user.fullName}
              className="w-7 h-7 rounded-full "
            />
          ) : (
            <div className="size-7 rounded-full bg-black" />
          )}
          <div className="">
            <p className="text-sm">{blog.user.username}</p>
            <p className="text-xs">{blog.user.fullName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="group">
        <Link to={`/blog/${blog.slug}`}>
          <h2 className="text-4xl pb-5 font-black group-hover:text-blue-900 text-wrap">
            {blog.title}
          </h2>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-5">
          <p className="flex gap-1 text-xs justify-center items-center">
            <Heart
              className={`size-5 ${isLiked && "fill-red-500 stroke-red-500"}`}
              onClick={handleLike}
            />
            {blog.likes?.length ?? 0}
          </p>
          <p className="flex gap-1 text-xs  justify-center items-center">
            <Bookmark className="size-5" />
            {blog.saves?.length ?? 0}
          </p>
        </div>
        <p className="text-xs ">{dateToWords(blog.createdAt.split("T")[0])}</p>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
