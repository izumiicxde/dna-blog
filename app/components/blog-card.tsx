import { Bookmark, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";
import { DisplayBlog } from "utils/types";
import { dateToWords } from "~/lib/utils";
import { useState } from "react";
import AvatarComponent from "./avatar";
import { useUserStore } from "utils/store";

const BlogCard = ({ blog }: { blog: DisplayBlog }) => {
  const { user } = useUserStore();
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = async () => {};

  return (
    <Card className="w-full lg:max-w-6xl shadow-none rounded-none border-0 border-b-2 border-b-black/5 ">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 ">
          <AvatarComponent
            fallback={blog.user.username}
            url={blog.user.image}
          />
          <div className="">
            <p className="text-sm cursor-pointer">
              <Link to={user ? `/user/${blog.user.username}` : "/login"}>
                {blog.user.username}
              </Link>
            </p>
            <p className="text-xs">{blog.user.fullName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="group">
        <Link to={`/blog/${blog.slug}`}>
          <h2 className="lg:text-4xl pb-2 font-black group-hover:text-blue-900 w-full truncate ">
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
