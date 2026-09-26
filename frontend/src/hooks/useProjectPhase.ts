import { PhaseStatus } from '../types';

export function useProjectPhase(status: PhaseStatus, locked?: boolean) {
  // 未开始 / 编制中 / 被驳回后才能提交；审核通过已锁定的阶段不能提交
  const canSubmit =
    !locked &&
    (status === PhaseStatus.NotStarted ||
      status === PhaseStatus.InProgress ||
      status === PhaseStatus.Revision);
  // 只有"提交中（待业主审核）"的方案可以被审核
  const canReview = !locked && status === PhaseStatus.Submitted;
  const isPendingReview = status === PhaseStatus.Submitted;
  const isApproved = status === PhaseStatus.Approved;
  return { canSubmit, canReview, isPendingReview, isApproved };
}
