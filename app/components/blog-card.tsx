import { Bookmark, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";
import { DisplayBlog } from "utils/types";
import { dateToWords } from "~/lib/utils";
import { useEffect, useState } from "react";
import AvatarComponent from "./avatar";
import { useUserStore } from "utils/store";
import { toast } from "sonner";
import { debounce } from "utils/debounce";

const BlogCard = ({ blog }: { blog: DisplayBlog }) => {
  const { user } = useUserStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes.length ?? 0);

  // blogId, userId, intent
  const likeAction = async () => {
    try {
      console.log("before request");
      const response = await fetch(`/blog/${blog.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "like",
          blogId: blog.id,
          userId: user?.id,
        }),
      });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "failed to like, check you connection"
      );
    }
  };

  const handleBlogLike = debounce(likeAction, 300);

  useEffect(() => {
    if (
      blog.likes.map((like) => {
        if (like.userId === user?.id) setIsLiked(true);
      })
    ) {
    }
  });

  return (
    <Card className="w-full lg:max-w-6xl shadow-none rounded-none border-0 border-b-2 border-b-black/5 ">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2 ">
          <AvatarComponent
            fallback={blog.user.username}
            url={blog.user.image}
          />
          <div className="">
            <p className="text-sm cursor-pointer">{blog.user.username}</p>
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
        <div className="flex gap-5 select-none">
          <p className="flex gap-1 text-xs justify-center items-center">
            <Heart
              className={`size-5 ${isLiked && "fill-red-500 stroke-red-500"}`}
              onClick={() => {
                if (user) {
                  handleBlogLike();
                  setIsLiked((prev) => !prev);
                  setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                }
              }}
            />
            {likeCount}
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
