import { Progress } from 'antd';

export function ProgressBar({ value }: { value: number }) {
  return <Progress percent={Math.min(100, Math.max(0, value))} size="small" />;
}
