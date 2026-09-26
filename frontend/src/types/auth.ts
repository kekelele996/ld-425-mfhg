import { UserRole } from './enums';

export interface CurrentUser {
  id: string;
  role: UserRole;
  name: string;
}

export interface DevTokenResponse {
  token: string;
  user: CurrentUser;
}
