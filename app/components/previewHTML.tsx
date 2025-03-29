import { useBlogContentStore } from "utils/store";

const PreviewHTML = () => {
  // const { editor } = useEditorStore();
  const { content } = useBlogContentStore();
  return (
    <div className="">
      {/* CONTENT */}
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose"
      ></div>
    </div>
  );
};

export default PreviewHTML;
