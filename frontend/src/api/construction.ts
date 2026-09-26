import { apiPaths } from '../constants/apiPaths';
import { ConstructionNode } from '../types';
import { request } from '../utils/request';

export const constructionApi = {
  list: () => request.get<unknown, ConstructionNode[]>(apiPaths.construction),
  inspect: (id: string, acceptanceStatus: string, acceptanceNote: string, photos: string[]) =>
    request.post<unknown, ConstructionNode>(`${apiPaths.construction}/${id}/inspect`, { acceptanceStatus, acceptanceNote, photos })
};
