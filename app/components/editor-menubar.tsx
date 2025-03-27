import { useCurrentEditor } from "@tiptap/react";
import { Bold } from "lucide-react";
import { Button } from "./ui/button";

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
    },
    {
      name: "italic",
      text: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "strike",
      text: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: "code",
      text: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
    },
    {
      name: "clearMarks",
      text: "Clear marks",
      action: () => editor.chain().focus().unsetAllMarks().run(),
    },
    {
      name: "clearNodes",
      text: "Clear nodes",
      action: () => editor.chain().focus().clearNodes().run(),
    },
    {
      name: "paragraph",
      text: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
    },
    ...[1, 2, 3, 4, 5, 6].map((level) => ({
      name: `heading-${level}`,
      text: `H${level}`,
      action: () => editor.chain().focus().toggleHeading({ level }).run(),
      isActive: editor.isActive("heading", { level }),
    })),
    {
      name: "bulletList",
      text: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "orderedList",
      text: "Ordered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: "codeBlock",
      text: "Code block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      name: "blockquote",
      text: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      name: "horizontalRule",
      text: "Horizontal rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      name: "hardBreak",
      text: "Hard break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      name: "undo",
      text: "Undo",
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      name: "redo",
      text: "Redo",
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
    {
      name: "color",
      text: "Purple",
      action: () => editor.chain().focus().setColor("#958DF1").run(),
      isActive: editor.isActive("textStyle", { color: "#958DF1" }),
    },
  ];

  return (
    <div className="py-8">
      <div className="flex flex-wrap gap-3">
        {buttons.map(({ name, text, icon, action, disabled, isActive }) => (
          <Button
            key={name}
            variant="ghost"
            onClick={action}
            disabled={disabled}
            className={isActive ? "is-active" : ""}
          >
            {icon || text}
          </Button>
        ))}
      </div>
    </div>
  );
};
