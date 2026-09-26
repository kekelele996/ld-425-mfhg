import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialItem } from '../models/materialItem.entity';
import { PurchaseStatus } from '../types/enums';
import { calculateMaterialTotal } from '../utils/budgetCalculator';
import { AuditLogService } from './auditLog.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialItem) private readonly repo: Repository<MaterialItem>,
    private readonly auditLog: AuditLogService
  ) {}

  findAll() {
    return this.repo.find({ relations: ['project'], order: { room: 'ASC' } });
  }

  async updateStatus(id: string, purchaseStatus: PurchaseStatus, userId: string) {
    const item = await this.repo.findOneByOrFail({ id });
    item.purchaseStatus = purchaseStatus;
    item.totalPrice = calculateMaterialTotal(Number(item.quantity), Number(item.unitPrice));
    await this.auditLog.record({ userId, action: 'update_material_purchase', entity: 'MaterialItem', entityId: id });
    return this.repo.save(item);
  }
}
