import { Button, Card, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { StepIndicator } from '../components/common/StepIndicator';
import { VersionTag } from '../components/common/VersionTag';
import { useProjectPhase } from '../hooks/useProjectPhase';
import { useDesignStore } from '../stores/designStore';

export function DesignManage() {
  const { designs, fetchDesigns, submitDesign, reviewDesign } = useDesignStore();

  useEffect(() => {
    void fetchDesigns();
  }, [fetchDesigns]);

  return (
    <div>
      <Typography.Title level={2}>设计管理</Typography.Title>
      <Card className="section">
        <StepIndicator phases={designs} />
      </Card>
      <div className="grid section">
        {designs.map((phase) => {
          const state = useProjectPhase(phase.status);
          return (
            <Card key={phase.id} title={phase.name} extra={<VersionTag version={phase.version} />}>
              <Space direction="vertical">
                <StatusBadge status={phase.status} />
                <span>{phase.description}</span>
                <Space>
                  <Button disabled={!state.canSubmit} onClick={() => void submitDesign(phase.id)}>提交设计</Button>
                  <Button disabled={!state.canReview} type="primary" onClick={() => void reviewDesign(phase.id, true)}>业主通过</Button>
                  <Button disabled={!state.canReview} danger onClick={() => void reviewDesign(phase.id, false)}>驳回修改</Button>
                </Space>
              </Space>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
