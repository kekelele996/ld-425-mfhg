import { Alert } from 'antd';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { message?: string }> {
  state = { message: undefined };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  render() {
    if (this.state.message) {
      return <Alert type="error" message="页面加载失败" description={this.state.message} />;
    }
    return this.props.children;
  }
}
