import { Tag } from 'antd';

export function ProgressTag({ value }: { value: number }) {
  return <Tag color={value >= 80 ? 'green' : value >= 40 ? 'blue' : 'orange'}>{value}%</Tag>;
}
