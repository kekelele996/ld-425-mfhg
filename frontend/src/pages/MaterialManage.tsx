import { Select, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressTag } from '../components/common/ProgressTag';
import { StatusBadge } from '../components/common/StatusBadge';
import { roomTypes } from '../constants/roomTypes';
import { useMaterialStore } from '../stores/materialStore';
import { PurchaseStatus } from '../types';
import { formatBudget } from '../utils/formatBudget';

export function MaterialManage() {
  const { materials, fetchMaterials, updateStatus } = useMaterialStore();
  const [room, setRoom] = useState<string>();

  useEffect(() => {
    void fetchMaterials();
  }, [fetchMaterials]);

  const filtered = useMemo(() => (room ? materials.filter((item) => item.room === room) : materials), [materials, room]);
  const progress = materials.length ? Math.round((materials.filter((item) => item.purchaseStatus === PurchaseStatus.Delivered || item.purchaseStatus === PurchaseStatus.Installed).length / materials.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>材料管理</Typography.Title>
        <Select allowClear placeholder="按空间筛选" style={{ width: 180 }} options={roomTypes.map((value) => ({ value, label: value }))} onChange={setRoom} />
      </div>
      <ProgressTag value={progress} />
      <Table
        className="section"
        rowKey="id"
        locale={{ emptyText: <EmptyState /> }}
        dataSource={filtered}
        columns={[
          { title: '材料', dataIndex: 'name' },
          { title: '品类', dataIndex: 'category' },
          { title: '空间', dataIndex: 'room' },
          { title: '品牌', dataIndex: 'brand' },
          { title: '金额', render: (_, item) => formatBudget(Number(item.totalPrice)) },
          { title: '采购状态', render: (_, item) => <StatusBadge status={item.purchaseStatus} /> },
          { title: '操作', render: (_, item) => <Select size="small" value={item.purchaseStatus} onChange={(value) => void updateStatus(item.id, value)} options={Object.values(PurchaseStatus).map((value) => ({ value, label: value }))} /> }
        ]}
      />
    </div>
  );
}
