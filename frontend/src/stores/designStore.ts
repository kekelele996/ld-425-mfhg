import { create } from 'zustand';
import { designApi } from '../api/design';
import { DesignPhase, DesignVersionRecord } from '../types';

interface DesignState {
  designs: DesignPhase[];
  records: Record<string, DesignVersionRecord[]>;
  fetchDesigns: () => Promise<void>;
  fetchRecords: (phaseId: string) => Promise<void>;
  submitDesign: (id: string, comment: string) => Promise<void>;
  reviewDesign: (id: string, approved: boolean, comment: string) => Promise<void>;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  records: {},
  async fetchDesigns() {
    set({ designs: await designApi.list() });
  },
  async fetchRecords(phaseId) {
    const list = await designApi.records(phaseId);
    set((state) => ({ records: { ...state.records, [phaseId]: list } }));
  },
  async submitDesign(id, comment) {
    await designApi.submit(id, { comment });
    await get().fetchDesigns();
    await get().fetchRecords(id);
  },
  async reviewDesign(id, approved, comment) {
    await designApi.review(id, approved, comment);
    await get().fetchDesigns();
    await get().fetchRecords(id);
  }
}));
