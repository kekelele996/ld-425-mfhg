import { Card, Statistic } from 'antd';

export function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <Statistic title={title} value={value} />
    </Card>
  );
}
