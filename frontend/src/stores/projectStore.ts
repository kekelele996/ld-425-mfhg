import { create } from 'zustand';
import { projectApi } from '../api/project';
import { RenovationProject } from '../types';

interface ProjectState {
  projects: RenovationProject[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  async fetchProjects() {
    set({ loading: true });
    try {
      set({ projects: await projectApi.list() });
    } finally {
      set({ loading: false });
    }
  }
}));
