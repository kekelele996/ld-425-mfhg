import { apiPaths } from '../constants/apiPaths';
import { RenovationProject } from '../types';
import { request } from '../utils/request';

export const projectApi = {
  list: () => request.get<unknown, RenovationProject[]>(apiPaths.projects)
};
