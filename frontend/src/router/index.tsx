import { Navigate, RouteObject } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { DesignManage } from '../pages/DesignManage';
import { MaterialManage } from '../pages/MaterialManage';
import { ConstructionProgress } from '../pages/ConstructionProgress';
import { BudgetManage } from '../pages/BudgetManage';
import { RoleGuard } from './guards';

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/dashboard', element: <RoleGuard><Dashboard /></RoleGuard> },
  { path: '/designs', element: <RoleGuard><DesignManage /></RoleGuard> },
  { path: '/materials', element: <RoleGuard><MaterialManage /></RoleGuard> },
  { path: '/construction', element: <RoleGuard><ConstructionProgress /></RoleGuard> },
  { path: '/budget', element: <RoleGuard><BudgetManage /></RoleGuard> }
];
