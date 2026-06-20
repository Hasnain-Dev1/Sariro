"use client";

import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  links?: { label: string; route: string }[];
  suggestions?: { id: string; label: string }[];
  ts: number;
}

interface ChatState {
  open: boolean;
  messages: ChatMessage[];
  loading: boolean;
  hasInteracted: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  push: (m: Omit<ChatMessage, "id" | "ts">) => void;
  setLoading: (v: boolean) => void;
  markInteracted: () => void;
  reset: () => void;
}

let counter = 0;
const uid = () => `m${Date.now()}_${counter++}`;

export const useChatStore = create<ChatState>((set) => ({
  open: false,
  messages: [],
  loading: false,
  hasInteracted: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
  push: (m) =>
    set((s) => ({
      messages: [...s.messages, { ...m, id: uid(), ts: Date.now() }],
    })),
  setLoading: (v) => set({ loading: v }),
  markInteracted: () => set({ hasInteracted: true }),
  reset: () => set({ messages: [], hasInteracted: false, loading: false }),
}));
