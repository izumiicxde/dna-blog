import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  Code2,
  CodeSquareIcon,
  Image,
  ItalicIcon,
  List,
  ListOrdered,
  MoreHorizontalIcon,
  Quote,
  Redo2,
  Strikethrough,
  Text,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "./ui/button";

import { useCallback } from "react";

type ButtonArrayType = {
  name: string;
  icon?: React.ReactElement;
  text: string;
  action: () => void;
  disabled?: boolean;
  isActive?: boolean;
};
export const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  const buttons: ButtonArrayType[] = [
    {
      name: "bold",
      text: "Bold",
      icon: <Bold />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      name: "italic",
      text: "Italic",
      icon: <ItalicIcon />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      name: "strike",
      text: "Strike",
      icon: <Strikethrough />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      name: "code",
      text: "Code",
      icon: <Code2 />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      name: "codeBlock",
      text: "Code block",
      icon: <CodeSquareIcon />,
      action: () => editor.commands.toggleCodeBlock(),
      isActive: editor.isActive("codeBlock"),
    },
    // {
    //   name: "clearMarks",
    //   text: "Clear marks",
    //   action: () => editor.chain().focus().unsetAllMarks().run(),
    // },
    // {
    //   name: "clearNodes",
    //   text: "Clear nodes",
    //   action: () => editor.chain().focus().clearNodes().run(),
    // },
    {
      name: "paragraph",
      text: "Paragraph",
      icon: <Text />,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    ...([1, 2, 3, 4, 5, 6] as const).map((level) => ({
      name: `heading-${level}`,
      text: `H${level}`,
      action: () =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
          .run(),
      isActive: editor.isActive("heading", {
        level: level as 1 | 2 | 3 | 4 | 5 | 6,
      }),
    })),

    {
      name: "bulletList",
      text: "Bullet list",
      icon: <List />,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "orderedList",
      text: "Ordered list",
      icon: <ListOrdered />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: "blockquote",
      text: "Blockquote",
      icon: <Quote />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      name: "horizontalRule",
      text: "Horizontal rule",
      icon: <MoreHorizontalIcon />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },

    {
      name: "undo",
      text: "Undo",
      icon: <Undo2 />,
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      name: "redo",
      text: "Redo",
      icon: <Redo2 />,
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  return (
    <div className="  sticky top-14 bg-white z-30 ">
      <div className="flex flex-wrap gap-3 justify-center">
        {buttons.map(({ name, text, icon, action, disabled, isActive }) => (
          <Button
            key={name}
            variant={"ghost"}
            onClick={action}
            disabled={disabled}
            className={isActive ? "bg-gray-400/20" : ""}
          >
            {icon || text}
          </Button>
        ))}
        <Button onClick={addImage} variant={"ghost"} size={"icon"}>
          <Image />
        </Button>
      </div>
    </div>
  );
};
