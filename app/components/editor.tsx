import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./editor-menubar";
import {
  Image,
  CodeBlockLowlight,
  ImageResize,
  Placeholder,
  Dropcursor,
  createLowlight,
  all,
} from "~/../utils/editor-imports";
import { useBlogContentStore, useEditorStore } from "utils/store";
import { EditorView } from "@tiptap/pm/view";
import { Slice } from "@tiptap/pm/model";
import { toast } from "sonner";
import { uploadFileToServer } from "utils/uploadthing";

// highlighting registration
const lowlight = createLowlight(all);

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Image.configure({
    inline: true,
  }),
  Dropcursor,
  CodeBlockLowlight.configure({
    lowlight,
    languageClassPrefix: "language-",
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "What's the title?";
      }

      return "Write your blog content here....";
    },
  }),
  ImageResize,
];

const Editor = () => {
  const { editor, setEditor } = useEditorStore();
  const { setContent, content } = useBlogContentStore();

  const handleImageDrop = (
    view: EditorView,
    event: DragEvent,
    slice: Slice,
    moved: boolean
  ): boolean => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      toast("uploading image please wait");
      let file = event.dataTransfer.files[0];
      let filesize = (file.size / 1024 / 1024).toFixed(4);

      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        parseFloat(filesize) < 10
      ) {
        let _URL = window.URL || window.webkitURL;
        let img = document.createElement("img"); // Fixes the `new Image()` error
        img.src = _URL.createObjectURL(file);

        img.onload = async function () {
          if (img.width > 5000 || img.height > 5000) {
            toast(
              "image needs to be less than 5000 pixels in height and width"
            );
          } else {
            const response = await uploadFileToServer(file);
            if (!response) {
              toast("failed to add image, please try again!");
              return false;
            }
            editor?.chain().focus().setImage({ src: response.url }).run();
          }
        };
      } else {
        toast("Image need to be in jpg or png format and less than 10MB.");
      }
      return true;
    }
    return false;
  };

  return (
    <div className="w-full h-auto relative">
      <EditorProvider
        onCreate={({ editor }) => {
          setEditor(editor);
          editor?.commands.setContent(content.body);
        }}
        onUpdate={({ editor }) => {
          setEditor(editor);
          setContent({ ...content, body: editor?.getHTML() });
        }}
        immediatelyRender={false}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content.body}
        onBlur={({ editor }) => {
          setContent({ ...content, body: editor?.getHTML() });
        }}
        editorProps={{
          handleDrop: handleImageDrop,
          attributes: {
            class:
              "p-3 pt-8 h-full min-h-[30vh]  prose-sm overflow-y-scroll relative",
          },
        }}
      ></EditorProvider>
    </div>
  );
};

export default Editor;
