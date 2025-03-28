import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./editor-menubar";
import {
  Image,
  CodeBlockLowlight,
  createLowlight,
  all,
} from "~/../utils/editor-imports";
import { useEditorStore } from "utils/store";

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

  Image,
  CodeBlockLowlight.configure({
    lowlight,
    languageClassPrefix: "language-",
  }),
];

const Editor = () => {
  const { setEditor } = useEditorStore();
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
        content={""}
        editorProps={{
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
