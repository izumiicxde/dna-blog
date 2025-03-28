import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./editor-menubar";
import {
  Bold,
  Code,
  Italic,
  BulletList,
  Document,
  Paragraph,
  HorizontalRuler,
  Text,
  Heading,
  OrderedList,
  Image,
  CodeBlock,
  CodeBlockLowlight,
  createLowlight,
  all,
} from "~/../utils/editor-imports";

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
  Bold,
  Code,
  Italic,
  Document,
  Paragraph,
  HorizontalRuler,
  Text,
  Heading,
  Image,
  CodeBlockLowlight.configure({
    lowlight,
    languageClassPrefix: "language-",
  }),
  BulletList,
  OrderedList,
  ListItem,
];

const content = ``;

export default () => {
  return (
    <EditorProvider
      immediatelyRender={false}
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          class:
            "p-3 h-full min-h-[30vh] prose-sm overflow-y-scroll max-h-[35vh] ",
        },
      }}
    ></EditorProvider>
  );
};
