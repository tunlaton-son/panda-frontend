import { create } from "zustand";
import { Post } from "../interface";

interface PostStoreState {
  post: Post | undefined;
  setPost: (post: Post) => void;
}

export const usePostStore = create<PostStoreState>((set) => ({
  post: undefined,
  setPost: (post: Post) => {
    set((state) => ({
      post: post,
    }));
  },
}));
