import { apiPaths } from '../constants/apiPaths';
import { DesignPhase, DesignVersionRecord } from '../types';
import { request } from '../utils/request';

export const designApi = {
  list: () => request.get<unknown, DesignPhase[]>(apiPaths.designs),
  records: (id: string) => request.get<unknown, DesignVersionRecord[]>(`${apiPaths.designs}/${id}/records`),
  submit: (id: string, payload: { comment?: string }) => request.post<unknown, DesignPhase>(`${apiPaths.designs}/${id}/submit`, payload),
  review: (id: string, approved: boolean, comment: string) => request.post<unknown, DesignPhase>(`${apiPaths.designs}/${id}/review`, { approved, comment })
};
