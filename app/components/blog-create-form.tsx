import { useBlogContentStore } from "utils/store";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import Editor from "./editor";
import { UploadButton } from "utils/uploadthing";
import { toast } from "sonner";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { BlogSchema } from "utils/blog.schema";
import { Blog } from "@prisma/client";

const BlogCreateForm = () => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { content, setContent, clearContent } = useBlogContentStore();

  const handleBlogSubmit = async () => {
    fetcher.submit(
      { ...content },
      {
        encType: "application/json",
        method: "POST",
        action: "/blog/create",
      }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      toast("Blog posted successfully.");
      clearContent();
      navigate("/");
    }
  }, [fetcher.data]);

  return (
    <Card className="w-full lg:mt-10  h-auto shadow-none border-none">
      <CardHeader>
        <div className="w-full flex items-center text-3xl text-gray-300">
          {!content.coverImage ? (
            <>
              <UploadImageButton
                loadingContent="Getting ready.."
                readyContent="Select cover image"
              />
            </>
          ) : (
            <div className="flex flex-col">
              <div className="flex gap-4">
                <UploadImageButton
                  loadingContent="Getting ready.."
                  readyContent="Change"
                />
                <Button
                  onClick={() => setContent({ ...content, coverImage: "" })}
                >
                  Remove
                </Button>
              </div>
              <img src={content.coverImage} className="w-fit max-w-sm" />
            </div>
          )}
        </div>
        <Input
          type="text"
          onChange={(e) => {
            setContent({ ...content, title: e.target.value });
          }}
          value={content.title}
          placeholder="New post title goes here...."
          className="w-full h-32 !text-5xl font-black placeholder:text-5xl p-5 rounded-lg focus:outline-none  focus:ring-none  focus-visible:ring-none focus:ring-0 focus-visible:outline-none focus:border-none  focus-visible:ring-0  outline-none ring-0 border-none shadow-none"
        />

        <Input
          placeholder="#webdev,#react, nohashtag...."
          value={content.tags}
          onChange={(event) => {
            const tags = event.target.value
              .split(" ")
              .map((tag) => tag.trim()) // Remove extra spaces
              .filter((tag) => tag !== "#")
              .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)); // Ensure # at start

            setContent({ ...content, tags });
          }}
          className="focus:outline-none  focus:ring-none  focus-visible:ring-none focus:ring-0 focus-visible:outline-none focus:border-none  focus-visible:ring-0  outline-none ring-0 border-none shadow-none"
        />
      </CardHeader>
      <CardContent className="w-full h-auto">
        <Editor />
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          className="px-20"
          variant={"default"}
          disabled={fetcher.state === "submitting"}
          onClick={handleBlogSubmit}
        >
          {fetcher.state === "submitting" ? "Posting..." : "Post"}
        </Button>
        <Button variant={"ghost"} onClick={clearContent}>
          Discard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCreateForm;

const UploadImageButton = ({
  loadingContent,
  readyContent,
}: {
  loadingContent: string;
  readyContent: string;
}) => {
  const { content, setContent } = useBlogContentStore();
  return (
    <UploadButton
      content={{
        button({ ready }) {
          if (ready) return readyContent;
          return loadingContent;
        },
      }}
      className=" text-sm ut-button:px-5 ut-button:w-full  ut-button:bg-gray-400/20 ut-button:text-black"
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res[0].serverData.url) {
          setContent({
            ...content,
            coverImage: res[0].serverData.url,
          });
        }
      }}
      onUploadError={(error: Error) => {
        toast("something went wrong, please try again.");
      }}
    />
  );
};
