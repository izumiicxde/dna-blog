import { Bookmark, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Link } from "@remix-run/react";

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
const BlogCard = ({ item }: BlogCardContent) => {
  return (
    <Card className="w-full ">
      <CardHeader className="flex items-start gap-4 ">
        <div className="flex items-center text-xs gap-3">
          {!item.url && <div className="w-10 h-10 rounded-full bg-black " />}
          <div className="flex flex-col ">
            <p className="flex gap-1 text-sm font-normal">
              <span className="font-semibold cursor-pointer">
                {item.author}
              </span>
              <span>for {item.team}</span>
            </p>
            <p className="text-xs">{item.date}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link
          to={`/blog/${item.title.split(" ").join("_")}`}
          className="w-full group"
        >
          <h2 className="text-3xl font-black group-hover:text-indigo-500">
            {item.title}
          </h2>
          <p className="text-sm py-1 px-2 rounded-lg hover:bg-blue-300/10 w-fit">
            {item.hashtag}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className=" flex gap-9 items-center ">
          <p>{item.reactions} reactions</p>
          <p className="flex gap-1 items-center">
            <MessageCircle className="size-4" />
            {item.comments} comments{" "}
          </p>
        </div>
        <div className="flex items-center gap-5 ">
          <p>{item.read_time}</p>
          <Bookmark className="size-5" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
