import { useBlogContentStore } from "utils/store";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Editor from "./editor";

const BlogCreateForm = () => {
  const { content, setContent } = useBlogContentStore();
  return (
    <Card className="w-full lg:mt-10  h-auto shadow-none border-none">
      <CardHeader>
        <div className="w-full flex justify-center items-center text-3xl text-gray-300 ">
          {content.coverImage ? (
            <>
              <Button
                variant={"ghost"}
                className="text-black bg-gray-300/20"
                asChild
              >
                <Label htmlFor="cover-image">Add Image</Label>
              </Button>
              <Input
                type="file"
                id="cover-image"
                name="cover-image"
                className="hidden"
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <Input
          type="text"
          onChange={(e) => {
            setContent({ ...content, title: e.target.value });
          }}
          value={content.title}
          placeholder="New post title goes here...."
          className="w-full h-32 !text-5xl font-black placeholder:text-5xl p-5 rounded-lg focus:outline-none focus:ring-none focus:ring-0 focus-visible:outline-none focus:border-none  focus-visible:ring-0 focus-visible:ring-none outline-none ring-0 border-none shadow-none "
        />
      </CardHeader>
      <CardContent className="w-full h-auto">
        <Editor />
      </CardContent>
    </Card>
  );
};

export default BlogCreateForm;
