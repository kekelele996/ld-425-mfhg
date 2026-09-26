import { Timeline as AntTimeline } from 'antd';
import { ConstructionNode } from '../../types';
import { StatusBadge } from './StatusBadge';

export function Timeline({ nodes }: { nodes: ConstructionNode[] }) {
  return (
    <AntTimeline
      items={nodes.map((node) => ({
        color: node.status === 'Delayed' ? 'red' : node.status === 'Completed' ? 'green' : 'blue',
        children: (
          <div>
            <strong>{node.name}</strong> <StatusBadge status={node.status} />
            <div>{node.plannedStartDate} 至 {node.plannedEndDate}</div>
          </div>
        )
      }))}
    />
  );
}
