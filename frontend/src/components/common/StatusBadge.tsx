import { Tag } from 'antd';

const colorMap: Record<string, string> = {
  InProgress: 'processing',
  Approved: 'success',
  Completed: 'success',
  Passed: 'success',
  Revision: 'warning',
  Delayed: 'error',
  Failed: 'error',
  Ordered: 'processing',
  Delivered: 'success',
  Installed: 'success'
};

export function StatusBadge({ status }: { status: string }) {
  return <Tag color={colorMap[status] ?? 'default'}>{status}</Tag>;
}
