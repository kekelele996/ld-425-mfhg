import { Space, Timeline, Typography } from 'antd';
import { DesignReviewAction, DesignVersionRecord } from '../../types';
import { EmptyState } from './EmptyState';
import { VersionTag } from './VersionTag';

const actionText: Record<DesignReviewAction, string> = {
  [DesignReviewAction.Submit]: '提交方案',
  [DesignReviewAction.Approve]: '审核通过',
  [DesignReviewAction.Reject]: '驳回修改'
};

const actionColor: Record<DesignReviewAction, string> = {
  [DesignReviewAction.Submit]: 'blue',
  [DesignReviewAction.Approve]: 'green',
  [DesignReviewAction.Reject]: 'red'
};

export function VersionRecordTimeline({ records }: { records: DesignVersionRecord[] }) {
  if (!records.length) {
    return <EmptyState description="暂无版本记录" />;
  }
  return (
    <Timeline
      items={records.map((record) => ({
        color: actionColor[record.action],
        children: (
          <div>
            <Space>
              <VersionTag version={record.version} />
              <strong>{actionText[record.action]}</strong>
            </Space>
            <div>
              <Typography.Text type="secondary">
                {record.operatorId} · {new Date(record.createdAt).toLocaleString('zh-CN')}
              </Typography.Text>
            </div>
            {record.comment && <div>意见：{record.comment}</div>}
            {record.action === DesignReviewAction.Submit && record.description && (
              <div>方案快照：{record.description}</div>
            )}
            {record.action === DesignReviewAction.Submit && !!record.fileUrls?.length && (
              <div>附件：{record.fileUrls.join('、')}</div>
            )}
          </div>
        )
      }))}
    />
  );
}
