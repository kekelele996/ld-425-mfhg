import { create } from 'zustand';
import { designApi, SubmitDesignPayload } from '../api/design';
import { DesignPhase } from '../types';

interface DesignState {
  designs: DesignPhase[];
  fetchDesigns: () => Promise<void>;
  submitDesign: (id: string, payload?: SubmitDesignPayload) => Promise<void>;
  reviewDesign: (id: string, approved: boolean, comment: string) => Promise<void>;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  async fetchDesigns() {
    set({ designs: await designApi.list() });
  },
  async submitDesign(id, payload) {
    await designApi.submit(id, payload);
    await get().fetchDesigns();
  },
  async reviewDesign(id, approved, comment) {
    await designApi.review(id, approved, comment);
    await get().fetchDesigns();
  }
}));
