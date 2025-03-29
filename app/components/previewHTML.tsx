import { useBlogContentStore } from "utils/store";

const PreviewHTML = () => {
  const { content } = useBlogContentStore();
  return (
    <div className="pb-32 pt-10  px-32">
      <div className="mx-auto">
        <h2 className="text-5xl font-black py-14">{content.title}</h2>
        <div
          dangerouslySetInnerHTML={{ __html: content.body }}
          className="prose-sm w-full content-preview "
        ></div>
      </div>
    </div>
  );
};

export default PreviewHTML;
