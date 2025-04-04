import { create } from "zustand";
import { Editor } from "@tiptap/react";
import { createJSONStorage, persist } from "zustand/middleware";
import { BlogSchema } from "./blog.schema";
import { ProfileUser } from "./types";

interface UserStore {
  user: ProfileUser | null;
  setUser: (user: ProfileUser | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "user-store" }
  )
);

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
  tags: "",
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
