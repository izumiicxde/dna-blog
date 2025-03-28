import { create } from "zustand";
import { Editor } from "@tiptap/react";

type EditorStore = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));

interface EditorContentStore {
  content: string;
  setContent: (content: string) => void;
}

export const useEditorContentStore = create<EditorContentStore>((set) => ({
  content: "",
  setContent: (content: string) => set({ content }),
}));
