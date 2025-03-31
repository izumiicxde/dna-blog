import { create } from "zustand";
import { Editor } from "@tiptap/react";
import { createJSONStorage, persist } from "zustand/middleware";
import { BlogSchema } from "./blog.schema";

type EditorStore = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));

interface EditorContentStore {
  content: BlogSchema;
  setContent: (content: BlogSchema) => void;
  clearContent: () => void;
}
const initialBlogContent = {
  title: "",
  body: "",
  coverImage: "",
  tags: [],
};

export const useBlogContentStore = create<EditorContentStore>()(
  persist(
    (set) => ({
      content: initialBlogContent,
      setContent: (content: BlogSchema) => set({ content }),
      clearContent: () => {
        set({ content: initialBlogContent });
      },
    }),
    {
      name: "blog-content-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
