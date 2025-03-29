import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import Tiptap from "~/components/editor";
import InputField from "~/components/input-field";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form as RForm } from "@remix-run/react";
import { useCurrentEditor } from "@tiptap/react";
import PreviewHTML from "~/components/previewHTML";
import { useBlogContentStore } from "utils/store";


const CreateBlog = () => {
  const [isPreview, setIsPreview] = useState(false);
  const {content,setContent} = useBlogContentStore()
  const form = useForm();

  const onsubmit = async (values: any) => {};

  return (
    <div className="flex flex-col w-full h-full  overflow-hidden ">
      <div className="w-full px-10 py-2 max-w-5xl flex justify-between items-center">
        <h1>Create Post</h1>
        <div className="flex gap-2 items-center">
          <Button variant={"ghost"} onClick={() => setIsPreview(false)}>
            Editor
          </Button>
          <Button variant={"ghost"} onClick={() => setIsPreview(true)}>
            Preview
          </Button>
        </div>
      </div>
      <div className="px-5 lg:pr-20">
        {isPreview ? (
          <div className="w-full h-auto p-5 ">
            <PreviewHTML />
          </div>
        ) : (
          <Card className="w-full ">
            {/* <Form {...form}> */}
            {/* <RForm onSubmit={form.handleSubmit(onsubmit)}> */}
            <CardHeader>
              <div className="w-full flex justify-center items-center text-3xl text-gray-300">
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
              </div>
              <Input
                type="text"
                onChange={(e)=> {
                  setContent({...content, title:e.target.value })
                }}
                value={content.title}
                placeholder="New post title goes here...."
                className="w-full h-32 !text-5xl font-black placeholder:text-5xl p-4 rounded-lg focus:outline-none focus:ring-none focus:ring-0 focus-visible:outline-none focus:border-none  focus-visible:ring-0 focus-visible:ring-none outline-none ring-0 border-none shadow-none"
              />
            </CardHeader>
            <CardContent className="w-full  ">
              <Tiptap />
            </CardContent>
            {/* </RForm> */}
            {/* </Form> */}
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
