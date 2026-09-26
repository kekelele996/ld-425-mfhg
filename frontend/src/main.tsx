import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, Layout, Menu, Typography } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useRoutes, BrowserRouter, Link, useLocation } from 'react-router-dom';
import { routes } from './router';
import { ErrorBoundary } from './ErrorBoundary';
import './styles.css';

function AppRoutes() {
  return useRoutes(routes);
}

function Shell() {
  const location = useLocation();
  return (
    <Layout className="app-shell">
      <Layout.Sider width={232} className="side">
        <Typography.Title level={4} className="brand">Home Renovation</Typography.Title>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/dashboard', label: <Link to="/dashboard">项目总览</Link> },
            { key: '/designs', label: <Link to="/designs">设计管理</Link> },
            { key: '/materials', label: <Link to="/materials">材料管理</Link> },
            { key: '/construction', label: <Link to="/construction">施工进度</Link> },
            { key: '/budget', label: <Link to="/budget">预算管理</Link> }
          ]}
        />
      </Layout.Sider>
      <Layout.Content className="content">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Layout.Content>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
