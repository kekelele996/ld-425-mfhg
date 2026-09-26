import { Alert } from 'antd';

export function AlertBanner({ message, type = 'warning' }: { message: string; type?: 'warning' | 'error' | 'info' | 'success' }) {
  return <Alert showIcon type={type} message={message} />;
}
