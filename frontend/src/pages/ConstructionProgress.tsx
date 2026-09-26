import { Button, Card, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { useConstructionStore } from '../stores/constructionStore';

export function ConstructionProgress() {
  const { nodes, fetchNodes, inspectNode } = useConstructionStore();

  useEffect(() => {
    void fetchNodes();
  }, [fetchNodes]);

  return (
    <div>
      <Typography.Title level={2}>施工进度</Typography.Title>
      <Card className="section">
        <Timeline nodes={nodes} />
      </Card>
      <div className="grid section">
        {nodes.map((node) => (
          <Card key={node.id} title={node.name}>
            <Space direction="vertical">
              <StatusBadge status={node.acceptanceStatus} />
              <span>{node.acceptanceNote}</span>
              <Space>
                <Button type="primary" onClick={() => void inspectNode(node.id, true)}>验收通过</Button>
                <Button danger onClick={() => void inspectNode(node.id, false)}>标记整改</Button>
              </Space>
            </Space>
          </Card>
        ))}
      </div>
    </div>
  );
}
