import { UserRole } from './enums';

export interface RequestUser {
  id: string;
  role: UserRole;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuditContext {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
}
