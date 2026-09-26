import { Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { designApi } from '../../api/design';
import { DesignVersion } from '../../types';
import { DesignVersionTimeline } from './DesignVersionTimeline';

interface Props {
  open: boolean;
  phaseId: string | null;
  phaseName: string;
  onClose: () => void;
}

export function VersionHistoryModal({ open, phaseId, phaseName, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<DesignVersion[]>([]);

  useEffect(() => {
    if (!open || !phaseId) {
      return;
    }
    setLoading(true);
    designApi
      .versions(phaseId)
      .then((history) => setVersions(history.versions))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [open, phaseId]);

  return (
    <Modal title={`版本记录 · ${phaseName}`} open={open} onCancel={onClose} footer={null} width={640}>
      {loading ? <Spin /> : <DesignVersionTimeline versions={versions} />}
    </Modal>
  );
}
