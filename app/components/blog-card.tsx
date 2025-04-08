import { Bookmark, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";
import { DisplayBlog } from "utils/types";
import { dateToWords } from "~/lib/utils";
import { useState } from "react";

const BlogCard = ({ blog }: { blog: DisplayBlog }) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = async () => {};

  return (
    <Card className="w-full shadow-none rounded-none border-0 border-b-2 border-b-black/5 ">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 ">
          {blog.user.image ? (
            <img
              src={blog.user.image}
              alt={blog.user.fullName}
              className="w-8 h-8 rounded-full "
            />
          ) : (
            <div className="size-8 rounded-full bg-black" />
          )}
          <div className="">
            <p className="text-sm">{blog.user.username}</p>
            <p className="text-xs">{blog.user.fullName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="group">
        <Link to={`/blog/${blog.slug}`}>
          <h2 className="lg:text-4xl pb-2 font-black group-hover:text-blue-900 w-full truncate line-clamp-1">
            {blog.title}
          </h2>
          <p className="flex gap-1.5 text-xs">
            {blog?.tags.map((tag) => (
              <span key={tag.tagId}>{tag?.tag.name}</span>
            ))}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between gap-5 text-xs">
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
