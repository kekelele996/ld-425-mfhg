import { Button, Card, Drawer, Input, Modal, Space, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { StepIndicator } from '../components/common/StepIndicator';
import { VersionRecordTimeline } from '../components/common/VersionRecordTimeline';
import { VersionTag } from '../components/common/VersionTag';
import { useProjectPhase } from '../hooks/useProjectPhase';
import { useDesignStore } from '../stores/designStore';
import { DesignPhase } from '../types';

type PendingAction = { type: 'submit' | 'approve' | 'reject'; phase: DesignPhase };

const actionTitle: Record<PendingAction['type'], string> = {
  submit: '提交设计',
  approve: '业主通过',
  reject: '驳回修改'
};

function DesignPhaseCard({ phase, onAction, onHistory }: {
  phase: DesignPhase;
  onAction: (action: PendingAction) => void;
  onHistory: (phase: DesignPhase) => void;
}) {
  const state = useProjectPhase(phase.status);
  return (
    <Card
      title={phase.name}
      extra={
        <Space>
          <VersionTag version={phase.version} />
          {state.isLocked && <Tag color="success">已锁定</Tag>}
        </Space>
      }
    >
      <Space direction="vertical">
        <StatusBadge status={phase.status} />
        <span>{phase.description}</span>
        {phase.reviewComment && <span>最近审核意见:{phase.reviewComment}</span>}
        <Space wrap>
          <Button disabled={!state.canSubmit} onClick={() => onAction({ type: 'submit', phase })}>提交设计</Button>
          <Button disabled={!state.canReview} type="primary" onClick={() => onAction({ type: 'approve', phase })}>业主通过</Button>
          <Button disabled={!state.canReview} danger onClick={() => onAction({ type: 'reject', phase })}>驳回修改</Button>
          <Button type="link" onClick={() => onHistory(phase)}>版本记录</Button>
        </Space>
      </Space>
    </Card>
  );
}

export function DesignManage() {
  const { designs, records, fetchDesigns, fetchRecords, submitDesign, reviewDesign } = useDesignStore();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [comment, setComment] = useState('');
  const [historyPhase, setHistoryPhase] = useState<DesignPhase | null>(null);

  useEffect(() => {
    void fetchDesigns();
  }, [fetchDesigns]);

  const openHistory = (phase: DesignPhase) => {
    setHistoryPhase(phase);
    void fetchRecords(phase.id);
  };

  const closeModal = () => {
    setPendingAction(null);
    setComment('');
  };

  const confirmAction = async () => {
    if (!pendingAction) {
      return;
    }
    const { type, phase } = pendingAction;
    try {
      if (type === 'submit') {
        await submitDesign(phase.id, comment);
      } else {
        await reviewDesign(phase.id, type === 'approve', comment);
      }
      message.success(`${actionTitle[type]}成功`);
      closeModal();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败');
    }
  };

  return (
    <div>
      <Typography.Title level={2}>设计管理</Typography.Title>
      <Card className="section">
        <StepIndicator phases={designs} />
      </Card>
      <div className="grid section">
        {designs.map((phase) => (
          <DesignPhaseCard key={phase.id} phase={phase} onAction={setPendingAction} onHistory={openHistory} />
        ))}
      </div>
      <Modal
        title={pendingAction ? `${actionTitle[pendingAction.type]} · ${pendingAction.phase.name} v${pendingAction.type === 'submit' ? pendingAction.phase.version + 1 : pendingAction.phase.version}` : ''}
        open={!!pendingAction}
        onOk={() => void confirmAction()}
        onCancel={closeModal}
        okText="确认"
        cancelText="取消"
      >
        <Input.TextArea
          rows={3}
          placeholder="请填写操作意见（将随操作人、时间一起留痕）"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </Modal>
      <Drawer
        title={historyPhase ? `版本记录 · ${historyPhase.name}` : '版本记录'}
        open={!!historyPhase}
        onClose={() => setHistoryPhase(null)}
        width={460}
      >
        <VersionRecordTimeline records={historyPhase ? records[historyPhase.id] ?? [] : []} />
      </Drawer>
    </div>
  );
}
