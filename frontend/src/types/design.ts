import { DesignReviewAction, PhaseStatus } from './enums';
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

export interface DesignVersionRecord {
  id: string;
  phaseId: string;
  version: number;
  action: DesignReviewAction;
  operatorId: string;
  comment?: string;
  description?: string;
  fileUrls?: string[];
  createdAt: string;
}
