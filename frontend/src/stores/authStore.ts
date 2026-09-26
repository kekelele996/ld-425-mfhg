import { create } from 'zustand';
import { authApi } from '../api/auth';
import { CurrentUser } from '../types';
import { getToken, setToken } from '../utils/request';

/** JWT payload 解码（base64url），用于从已缓存 token 恢复用户信息 */
function decodeToken(token: string): CurrentUser | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(window.atob(normalized));
    if (!data?.id || !data?.role) {
      return null;
    }
    return { id: data.id, role: data.role, name: data.name };
  } catch {
    return null;
  }
}

interface AuthState {
  user: CurrentUser | null;
  switchUser: (userId: string) => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  async switchUser(userId) {
    const { token, user } = await authApi.devToken(userId);
    setToken(token);
    set({ user });
  },

  async init() {
    const cached = getToken();
    if (cached) {
      const user = decodeToken(cached);
      if (user) {
        set({ user });
        return;
      }
    }
    // 默认以业主身份进入，便于走审核流程
    const { token, user } = await authApi.devToken('owner-001');
    setToken(token);
    set({ user });
  }
}));
