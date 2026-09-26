import { apiPaths } from '../constants/apiPaths';
import { DesignPhase, DesignVersionHistory } from '../types';
import { request } from '../utils/request';

export interface SubmitDesignPayload {
  description?: string;
  fileUrls?: string[];
  comment?: string;
}

export const designApi = {
  list: () => request.get<unknown, DesignPhase[]>(apiPaths.designs),

  versions: (id: string) =>
    request.get<unknown, DesignVersionHistory>(`${apiPaths.designs}/${id}/versions`),

  submit: (id: string, payload: SubmitDesignPayload = {}) =>
    request.post<unknown, { phase: DesignPhase }>(`${apiPaths.designs}/${id}/submit`, payload),

  review: (id: string, approved: boolean, comment: string) =>
    request.post<unknown, { phase: DesignPhase }>(`${apiPaths.designs}/${id}/review`, { approved, comment })
};
