import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./editor-menubar";
import {
  Image,
  CodeBlockLowlight,
  Dropcursor,
  createLowlight,
  all,
} from "~/../utils/editor-imports";
import { useBlogContentStore, useEditorStore } from "utils/store";
import { EditorView } from "@tiptap/pm/view";
import { Slice } from "@tiptap/pm/model";
import { toast } from "sonner";

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
];

const Editor = () => {
  const { setEditor } = useEditorStore();
  const { setContent, content } = useBlogContentStore();

  function handleImageDrop(
    view: EditorView,
    event: DragEvent,
    slice: Slice,
    moved: boolean
  ): boolean {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      let file = event.dataTransfer.files[0];
      let filesize = (file.size / 1024 / 1024).toFixed(4);

      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        parseFloat(filesize) < 10
      ) {
        let _URL = window.URL || window.webkitURL;
        let img = document.createElement("img"); // Fixes the `new Image()` error
        img.src = _URL.createObjectURL(file);

        img.onload = function () {
          if (img.width > 5000 || img.height > 5000) {
            toast(
              "image needs to be less than 5000 pixels in height and width"
            );
          } else {
            //TODO: upload the image to the server.
            toast("valid image uploaded");
            // uploadImage(file)
            //   .then((response) => {
            //     console.log("Image uploaded:", response);
            //     // Insert the image URL into the editor here
            //   })
            //   .catch((error) => {
            //     window.alert(
            //       "There was a problem uploading your image, please try again."
            //     );
            //   });
          }
        };
      } else {
        toast("Image need to be in jpg or png format and less than 10MB.");
      }
      return true;
    }
    return false;
  }

  return (
    <>
      <EditorProvider
        onCreate={({ editor }) => {
          setEditor(editor);
        }}
        onUpdate={({ editor }) => {
          setEditor(editor);
        }}
        immediatelyRender={false}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onBlur={({ editor }) => {
          setContent({ ...content, body: editor?.getHTML() });
        }}
        editorProps={{
          handleDrop: handleImageDrop,
          attributes: {
            class:
              "p-3 h-full min-h-[30vh] prose-sm overflow-y-scroll max-h-[35vh] ",
          },
        }}
      ></EditorProvider>
    </>
  );
};

export default Editor;
