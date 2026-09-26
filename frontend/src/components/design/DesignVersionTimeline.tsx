import { Empty, Tag, Timeline as AntTimeline, Typography } from 'antd';
import { DesignReviewResult, DesignVersion } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

function formatTime(value?: string | null) {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleString('zh-CN', { hour12: false });
}

/**
 * 设计版本记录：沿版本展示每次提交（提交人/时间/意见）
 * 以及对应的审核结论（审核人/时间/意见）。
 */
export function DesignVersionTimeline({ versions }: { versions: DesignVersion[] }) {
  if (!versions.length) {
    return <Empty description="暂无提交记录" />;
  }

  return (
    <AntTimeline
      items={versions.map((snapshot) => ({
        color:
          snapshot.reviewResult === DesignReviewResult.Approved
            ? 'green'
            : snapshot.reviewResult === DesignReviewResult.Rejected
              ? 'red'
              : 'blue',
        children: (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Tag color="geekblue">v{snapshot.version}</Tag>
              {snapshot.reviewResult ? (
                <StatusBadge
                  status={snapshot.reviewResult === DesignReviewResult.Approved ? 'Approved' : 'Revision'}
                />
              ) : (
                <Tag color="processing">待审核</Tag>
              )}
            </div>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 4 }}>
              {snapshot.description}
            </Typography.Paragraph>
            <div>
              提交：{snapshot.submittedByName ?? snapshot.submittedById} · {formatTime(snapshot.submittedAt)}
            </div>
            {snapshot.submitComment && (
              <Typography.Text type="secondary">提交意见：{snapshot.submitComment}</Typography.Text>
            )}
            {snapshot.reviewResult && (
              <div style={{ marginTop: 4 }}>
                <div>
                  审核：{snapshot.reviewerName ?? snapshot.reviewerId} · {formatTime(snapshot.reviewedAt)}
                </div>
                <Typography.Text
                  type={snapshot.reviewResult === DesignReviewResult.Approved ? 'success' : 'danger'}
                >
                  审核意见：{snapshot.reviewComment}
                </Typography.Text>
              </div>
            )}
          </div>
        )
      }))}
    />
  );
}
