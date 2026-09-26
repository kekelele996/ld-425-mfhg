import { Button, Card, Table, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';
import { AlertBanner } from '../components/common/AlertBanner';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatCard } from '../components/common/StatCard';
import { useBudgetStore } from '../stores/budgetStore';
import { formatBudget, getVarianceRate } from '../utils/formatBudget';

export function BudgetManage() {
  const { budgets, fetchBudgets, adjustActualCost } = useBudgetStore();

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  const totalBudget = budgets.reduce((sum, item) => sum + Number(item.budgetAmount), 0);
  const totalActual = budgets.reduce((sum, item) => sum + Number(item.actualCost), 0);
  const overBudget = budgets.filter((item) => Number(item.variance) < 0);

  return (
    <div>
      <Typography.Title level={2}>预算管理</Typography.Title>
      {overBudget.length > 0 && <AlertBanner type="error" message={`${overBudget.length} 个预算类别已超支。`} />}
      <div className="grid section">
        <StatCard title="总预算" value={formatBudget(totalBudget)} />
        <StatCard title="实际花费" value={formatBudget(totalActual)} />
        <Card title="执行率"><ProgressBar value={getVarianceRate(totalBudget, totalActual)} /></Card>
      </div>
      <Card className="section" title="预算 vs 实际">
        <ReactECharts style={{ height: 260 }} option={{ xAxis: { type: 'category', data: budgets.map((item) => item.category) }, yAxis: { type: 'value' }, series: [{ name: '预算', type: 'bar', data: budgets.map((item) => item.budgetAmount) }, { name: '实际', type: 'bar', data: budgets.map((item) => item.actualCost) }] }} />
      </Card>
      <Table
        className="section"
        rowKey="id"
        dataSource={budgets}
        columns={[
          { title: '类别', dataIndex: 'category' },
          { title: '预算金额', render: (_, item) => formatBudget(Number(item.budgetAmount)) },
          { title: '实际花费', render: (_, item) => formatBudget(Number(item.actualCost)) },
          { title: '差异', render: (_, item) => formatBudget(Number(item.variance)) },
          { title: '操作', render: (_, item) => <Button onClick={() => void adjustActualCost(item.id, Number(item.actualCost) + 1000)}>追加 1000</Button> }
        ]}
      />
    </div>
  );
}
