import { DesignReviewResult, PhaseStatus } from './enums';
import { RenovationProject } from './project';

/** 设计版本快照：一次提交生成一条，审核结论与意见沉淀在快照上 */
export interface DesignVersion {
  id: string;
  phaseId: string;
  version: number;
  description: string;
  fileUrls: string[];
  submittedById: string;
  submittedByName?: string;
  submittedAt: string;
  submitComment?: string | null;
  reviewResult?: DesignReviewResult | null;
  reviewerId?: string | null;
  reviewerName?: string | null;
  reviewComment?: string | null;
  reviewedAt?: string | null;
}

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
  /** 审核通过后锁定 */
  locked: boolean;
  /** 当前待审/已审版本快照 ID */
  currentVersionId?: string | null;
  versions?: DesignVersion[];
}

export interface DesignVersionHistory {
  phase: DesignPhase;
  versions: DesignVersion[];
}
