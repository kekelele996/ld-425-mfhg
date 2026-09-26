import { Card, List, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';
import { AlertBanner } from '../components/common/AlertBanner';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { useProjectStore } from '../stores/projectStore';
import { formatBudget, getVarianceRate } from '../utils/formatBudget';

export function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const project = projects[0];
  const delayed = project?.constructionNodes?.filter((node) => node.status === 'Delayed') ?? [];
  const budgetTotal = project?.budgets?.reduce((sum, item) => sum + Number(item.budgetAmount), 0) ?? 0;
  const actualTotal = project?.budgets?.reduce((sum, item) => sum + Number(item.actualCost), 0) ?? 0;

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>项目总览</Typography.Title>
      </div>
      {delayed.length > 0 && <AlertBanner message={`${delayed.length} 个施工节点延期，请安排验收与排期调整。`} />}
      <div className="grid section">
        {projects.map((item) => (
          <Card key={item.id} title={item.name}>
            <p>{item.address}</p>
            <StatusBadge status={item.status} />
            <p>{item.decorStyle} / {item.area}m² / {formatBudget(Number(item.contractAmount))}</p>
          </Card>
        ))}
      </div>
      {project && (
        <div className="grid section">
          <Card title="预算执行率">
            <ProgressBar value={getVarianceRate(budgetTotal, actualTotal)} />
            <ReactECharts style={{ height: 220 }} option={{ series: [{ type: 'pie', radius: ['55%', '75%'], data: [{ value: actualTotal, name: '已用' }, { value: Math.max(0, budgetTotal - actualTotal), name: '剩余' }] }] }} />
          </Card>
          <Card title="施工甘特概览">
            <List dataSource={project.constructionNodes ?? []} renderItem={(node) => <List.Item><StatusBadge status={node.status} /> {node.name}：{node.plannedStartDate} 至 {node.plannedEndDate}</List.Item>} />
          </Card>
        </div>
      )}
    </div>
  );
}
