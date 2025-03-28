import { useEditorContentStore, useEditorStore } from "utils/store";

const PreviewHTML = () => {
  // const { editor } = useEditorStore();
  const { content } = useEditorContentStore();
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
