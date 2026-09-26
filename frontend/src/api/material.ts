import { apiPaths } from '../constants/apiPaths';
import { MaterialItem, PurchaseStatus } from '../types';
import { request } from '../utils/request';

export const materialApi = {
  list: () => request.get<unknown, MaterialItem[]>(apiPaths.materials),
  updateStatus: (id: string, purchaseStatus: PurchaseStatus) => request.patch<unknown, MaterialItem>(`${apiPaths.materials}/${id}/status`, { purchaseStatus })
};
