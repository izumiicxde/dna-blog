import Tiptap from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

const CreateBlog = () => {
  return (
    <div className="flex flex-col w-full h-full ">
      <div className="w-full px-10 py-2 max-w-5xl flex justify-between items-center">
        <h1>Create Post</h1>
        <div className="flex gap-2 items-center">
          <Button variant={"ghost"}>Editor</Button>
          <Button variant={"ghost"}>Preview</Button>
        </div>
      </div>
      <div className="px-5 lg:pr-20">
        <Card className="w-full ">
          <CardHeader>
            <div className="w-full flex justify-center items-center text-3xl text-gray-300">
              AN IMAGE HOLDER TOO
            </div>
            <Input
              type="text"
              placeholder="New post title goes here...."
              className="w-full h-32 !text-5xl font-black placeholder:text-5xl p-4 rounded-lg focus:outline-none focus:ring-none focus:ring-0 focus-visible:outline-none focus:border-none  focus-visible:ring-0 focus-visible:ring-none outline-none ring-0 border-none shadow-none"
            />
          </CardHeader>
          <CardContent className="w-full min-h-[45vh] ">
            <Tiptap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
