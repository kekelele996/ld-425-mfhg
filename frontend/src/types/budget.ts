import { BudgetCategory } from './enums';
import { RenovationProject } from './project';

export interface BudgetItem {
  id: string;
  projectId: string;
  project?: RenovationProject;
  category: BudgetCategory;
  budgetAmount: number;
  actualCost: number;
  variance: number;
  note: string;
}
