import { apiPaths } from '../constants/apiPaths';
import { DesignPhase } from '../types';
import { request } from '../utils/request';

export const designApi = {
  list: () => request.get<unknown, DesignPhase[]>(apiPaths.designs),
  submit: (id: string) => request.post<unknown, DesignPhase>(`${apiPaths.designs}/${id}/submit`),
  review: (id: string, approved: boolean, comment: string) => request.post<unknown, DesignPhase>(`${apiPaths.designs}/${id}/review`, { approved, comment })
};
