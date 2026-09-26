import { create } from 'zustand';
import { designApi } from '../api/design';
import { DesignPhase } from '../types';

interface DesignState {
  designs: DesignPhase[];
  fetchDesigns: () => Promise<void>;
  submitDesign: (id: string) => Promise<void>;
  reviewDesign: (id: string, approved: boolean) => Promise<void>;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  async fetchDesigns() {
    set({ designs: await designApi.list() });
  },
  async submitDesign(id) {
    await designApi.submit(id);
    await get().fetchDesigns();
  },
  async reviewDesign(id, approved) {
    await designApi.review(id, approved, approved ? '方案确认通过' : '请调整收纳比例');
    await get().fetchDesigns();
  }
}));
