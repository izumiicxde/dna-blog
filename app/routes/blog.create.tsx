import { useState } from "react";
import { Button } from "~/components/ui/button";
import PreviewHTML from "~/components/previewHTML";
import BlogCreateForm from "~/components/blog-create-form";

const CreateBlog = () => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="w-full h-full px-10 pb-10">
      <div className="pt-10 px-10 flex justify-between items-center">
        <p className="text-lg font-medium">Create Post</p>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPreview(false)}
            variant={!isPreview ? "secondary" : "ghost"}
          >
            Editor
          </Button>
          <Button
            onClick={() => setIsPreview(true)}
            variant={isPreview ? "secondary" : "ghost"}
          >
            Preview
          </Button>
        </div>
      </div>
      {isPreview ? <PreviewHTML /> : <BlogCreateForm />}
    </div>
  );
};

export default CreateBlog;
