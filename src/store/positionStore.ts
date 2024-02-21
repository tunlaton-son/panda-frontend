import { create } from "zustand";

interface PositionState {
  topRef: React.RefObject<HTMLDivElement> | undefined;
  bottomRef: React.RefObject<HTMLDivElement> | undefined;
  setTopRef: (topRef: React.RefObject<HTMLDivElement>) => void;
  setBottomRef: (bottomRef: React.RefObject<HTMLDivElement>) => void;
}

export const usePositionStore = create<PositionState>((set) => ({
  topRef: undefined,
  bottomRef: undefined,
  setTopRef: (topRef: React.RefObject<HTMLDivElement>) => {
    set((state) => ({
      topRef: topRef,
    }));
  },
  setBottomRef: (bottomRef: React.RefObject<HTMLDivElement>) => {
    set((state) => ({
      bottomRef: bottomRef,
    }));
  },
}));
