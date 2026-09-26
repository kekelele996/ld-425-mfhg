import { ConstructionPhase } from './enums';
import { RenovationProject } from './project';

export interface ConstructionNode {
  id: string;
  projectId: string;
  project?: RenovationProject;
  name: ConstructionPhase;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: string;
  acceptanceStatus: string;
  acceptancePhotoUrls: string[];
  acceptanceNote: string;
}
