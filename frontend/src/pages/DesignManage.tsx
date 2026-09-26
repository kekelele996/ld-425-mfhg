import { Card, message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { DesignPhaseCard } from '../components/design/DesignPhaseCard';
import { ReviewDesignModal } from '../components/design/ReviewDesignModal';
import { SubmitDesignModal } from '../components/design/SubmitDesignModal';
import { VersionHistoryModal } from '../components/design/VersionHistoryModal';
import { StepIndicator } from '../components/common/StepIndicator';
import { useAuthStore } from '../stores/authStore';
import { useDesignStore } from '../stores/designStore';
import { DesignPhase } from '../types';

export function DesignManage() {
  const { user } = useAuthStore();
  const { designs, fetchDesigns, submitDesign, reviewDesign } = useDesignStore();
  const [submitTarget, setSubmitTarget] = useState<DesignPhase | null>(null);
  const [reviewTarget, setReviewTarget] = useState<DesignPhase | null>(null);
  const [historyTarget, setHistoryTarget] = useState<DesignPhase | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    void fetchDesigns();
  }, [fetchDesigns]);

  const handleSubmit = async (comment: string) => {
    if (!submitTarget) {
      return;
    }
    setActionLoading(true);
    try {
      await submitDesign(submitTarget.id, { comment });
      messageApi.success('方案已提交，等待业主审核');
      setSubmitTarget(null);
    } catch (error) {
      messageApi.error((error as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async (approved: boolean, comment: string) => {
    if (!reviewTarget) {
      return;
    }
    setActionLoading(true);
    try {
      await reviewDesign(reviewTarget.id, approved, comment);
      messageApi.success(approved ? '已通过，该版本已锁定' : '已驳回，进入修改');
      setReviewTarget(null);
    } catch (error) {
      messageApi.error((error as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <Typography.Title level={2}>设计管理</Typography.Title>
      <Card className="section">
        <StepIndicator phases={designs} />
      </Card>
      <div className="grid section">
        {designs.map((phase) => (
          <DesignPhaseCard
            key={phase.id}
            phase={phase}
            role={user?.role}
            onSubmit={setSubmitTarget}
            onReview={setReviewTarget}
            onShowHistory={setHistoryTarget}
          />
        ))}
      </div>

      <SubmitDesignModal
        open={!!submitTarget}
        loading={actionLoading}
        onCancel={() => setSubmitTarget(null)}
        onSubmit={handleSubmit}
      />
      <ReviewDesignModal
        open={!!reviewTarget}
        loading={actionLoading}
        onCancel={() => setReviewTarget(null)}
        onSubmit={handleReview}
      />
      <VersionHistoryModal
        open={!!historyTarget}
        phaseId={historyTarget?.id ?? null}
        phaseName={historyTarget?.name ?? ''}
        onClose={() => setHistoryTarget(null)}
      />
    </div>
  );
}
