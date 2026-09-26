import { PhaseStatus } from './enums';
import { RenovationProject } from './project';

export interface DesignPhase {
  id: string;
  projectId: string;
  project?: RenovationProject;
  name: string;
  designerId: string;
  status: PhaseStatus;
  version: number;
  description: string;
  fileUrls: string[];
  reviewComment?: string;
  reviewerId?: string;
}
