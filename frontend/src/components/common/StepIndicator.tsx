import { Steps } from 'antd';
import { DesignPhase, PhaseStatus } from '../../types';

export function StepIndicator({ phases }: { phases: DesignPhase[] }) {
  return (
    <Steps
      size="small"
      items={phases.map((phase) => ({
        title: phase.name,
        description: `v${phase.version}`,
        status:
          phase.status === PhaseStatus.Approved
            ? 'finish'
            : phase.status === PhaseStatus.Submitted
              ? 'wait'
              : phase.status === PhaseStatus.Revision
                ? 'error'
                : 'process'
      }))}
    />
  );
}
