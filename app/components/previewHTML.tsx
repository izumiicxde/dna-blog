import { useEditorStore } from "utils/store";

const PreviewHTML = () => {
  const { editor } = useEditorStore();
  console.log(editor);
  return (
    <div className="border-4 border-red-500">
      <>{editor?.getHTML()}</>
    </div>
  );
};

export default PreviewHTML;
