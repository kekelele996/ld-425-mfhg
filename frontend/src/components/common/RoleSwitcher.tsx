import { message, Select, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { UserRole } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const userOptions = [
  { value: 'owner-001', label: '业主 · 林女士', role: UserRole.Owner },
  { value: 'designer-001', label: '设计师 · 周工', role: UserRole.Designer },
  { value: 'contractor-001', label: '施工队长 · 王师傅', role: UserRole.Contractor },
  { value: 'pm-001', label: '项目经理', role: UserRole.ProjectManager }
];

export function RoleSwitcher() {
  const { user, init, switchUser } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    void init().catch(() => {
      messageApi.error('身份初始化失败，请确认后端服务已启动');
    });
  }, [init, messageApi]);

  return (
    <Space style={{ marginBottom: 16 }}>
      {contextHolder}
      <Typography.Text type="secondary">当前身份：</Typography.Text>
      <Select
        value={user?.id}
        style={{ width: 200 }}
        options={userOptions.map((item) => ({ value: item.value, label: item.label }))}
        onChange={(value) => void switchUser(value)}
      />
      {user && <Tag color={user.role === UserRole.Owner ? 'gold' : 'blue'}>{user.role}</Tag>}
    </Space>
  );
}
