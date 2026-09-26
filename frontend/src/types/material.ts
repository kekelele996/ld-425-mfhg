import { PurchaseStatus } from './enums';
import { RenovationProject } from './project';

export interface MaterialItem {
  id: string;
  projectId: string;
  project?: RenovationProject;
  name: string;
  category: string;
  spec: string;
  brand: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  purchaseStatus: PurchaseStatus;
  supplier: string;
  room: string;
}
