import { DecorStyle, ProjectStatus } from './enums';
import { BudgetItem } from './budget';
import { ConstructionNode } from './construction';

export interface RenovationProject {
  id: string;
  name: string;
  houseType: string;
  area: number;
  decorStyle: DecorStyle;
  address: string;
  ownerId: string;
  designerId: string;
  contractorId: string;
  status: ProjectStatus;
  contractAmount: number;
  startDate: string;
  expectedEndDate: string;
  budgets?: BudgetItem[];
  constructionNodes?: ConstructionNode[];
}
