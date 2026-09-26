import { create } from 'zustand';
import { constructionApi } from '../api/construction';
import { ConstructionNode } from '../types';

interface ConstructionState {
  nodes: ConstructionNode[];
  fetchNodes: () => Promise<void>;
  inspectNode: (id: string, passed: boolean) => Promise<void>;
}

export const useConstructionStore = create<ConstructionState>((set, get) => ({
  nodes: [],
  async fetchNodes() {
    set({ nodes: await constructionApi.list() });
  },
  async inspectNode(id, passed) {
    await constructionApi.inspect(id, passed ? 'Passed' : 'Failed', passed ? '现场验收通过' : '需整改后复验', []);
    await get().fetchNodes();
  }
}));
