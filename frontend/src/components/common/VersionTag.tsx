import { Tag } from 'antd';

export function VersionTag({ version }: { version: number }) {
  return <Tag color="geekblue">v{version}</Tag>;
}
