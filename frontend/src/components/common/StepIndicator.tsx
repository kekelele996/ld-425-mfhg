import { Steps } from 'antd';
import { DesignPhase } from '../../types';

export function StepIndicator({ phases }: { phases: DesignPhase[] }) {
  return <Steps size="small" items={phases.map((phase) => ({ title: phase.name, description: `v${phase.version}`, status: phase.status === 'Approved' ? 'finish' : 'process' }))} />;
}
