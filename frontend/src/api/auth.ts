import { apiPaths } from '../constants/apiPaths';
import { DevTokenResponse } from '../types';
import { request } from '../utils/request';

export const authApi = {
  /** 演示环境按预置用户身份换取 JWT */
  devToken: (userId: string) =>
    request.post<unknown, DevTokenResponse>(apiPaths.authDevToken, { userId })
};
