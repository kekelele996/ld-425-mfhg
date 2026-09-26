import { create } from 'zustand';
import { budgetApi } from '../api/budget';
import { BudgetItem } from '../types';

interface BudgetState {
  budgets: BudgetItem[];
  fetchBudgets: () => Promise<void>;
  adjustActualCost: (id: string, actualCost: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  async fetchBudgets() {
    set({ budgets: await budgetApi.list() });
  },
  async adjustActualCost(id, actualCost) {
    await budgetApi.adjustActualCost(id, actualCost);
    await get().fetchBudgets();
  }
}));
