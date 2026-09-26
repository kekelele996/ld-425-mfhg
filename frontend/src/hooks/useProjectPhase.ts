import { PhaseStatus } from '../types';

export function useProjectPhase(status: PhaseStatus) {
  const canSubmit = status === PhaseStatus.NotStarted || status === PhaseStatus.Revision;
  const canReview = status === PhaseStatus.InProgress;
  return { canSubmit, canReview, isApproved: status === PhaseStatus.Approved };
}
