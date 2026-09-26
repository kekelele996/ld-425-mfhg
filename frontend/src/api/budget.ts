import { apiPaths } from '../constants/apiPaths';
import { BudgetItem } from '../types';
import { request } from '../utils/request';

export const budgetApi = {
  list: () => request.get<unknown, BudgetItem[]>(apiPaths.budgets),
  adjustActualCost: (id: string, actualCost: number) => request.patch<unknown, BudgetItem>(`${apiPaths.budgets}/${id}/actual-cost`, { actualCost })
};
