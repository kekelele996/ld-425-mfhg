import { Lock } from 'lucide-react';
import { Tag } from 'antd';

export function VersionTag({ version, locked }: { version: number; locked?: boolean }) {
  return (
    <Tag color={locked ? 'green' : 'geekblue'}>
      {locked && <Lock size={12} style={{ marginRight: 4 }} />}v{version}
    </Tag>
  );
}
