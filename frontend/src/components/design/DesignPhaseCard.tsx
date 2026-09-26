import { Button, Card, Space, Typography } from 'antd';
import { History, Lock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { VersionTag } from '../common/VersionTag';
import { useProjectPhase } from '../../hooks/useProjectPhase';
import { DesignPhase, UserRole } from '../../types';

interface Props {
  phase: DesignPhase;
  role?: UserRole;
  onSubmit: (phase: DesignPhase) => void;
  onReview: (phase: DesignPhase) => void;
  onShowHistory: (phase: DesignPhase) => void;
}

export function DesignPhaseCard({ phase, role, onSubmit, onReview, onShowHistory }: Props) {
  const state = useProjectPhase(phase.status, phase.locked);
  const isOwner = role === UserRole.Owner;
  const isDesigner = role === UserRole.Designer;

  return (
    <Card
      title={
        <Space>
          {phase.name}
          {phase.locked && (
            <Typography.Text type="success">
              <Lock size={14} /> 已锁定
            </Typography.Text>
          )}
        </Space>
      }
      extra={<VersionTag version={phase.version} locked={phase.locked} />}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <StatusBadge status={phase.status} />
        <span>{phase.description}</span>
        {state.isPendingReview && (
          <Typography.Text type="warning">方案提交中，等待业主审核</Typography.Text>
        )}
        {phase.reviewComment && (
          <Typography.Text type={phase.locked ? 'success' : 'danger'}>
            最近审核意见：{phase.reviewComment}
          </Typography.Text>
        )}
        <Space wrap>
          {isDesigner && (
            <Button disabled={!state.canSubmit} onClick={() => onSubmit(phase)}>
              提交设计
            </Button>
          )}
          {isOwner && (
            <Button type="primary" disabled={!state.canReview} onClick={() => onReview(phase)}>
              业主审核
            </Button>
          )}
          <Button icon={<History size={14} />} onClick={() => onShowHistory(phase)}>
            版本记录
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
