import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetItem } from '../models/budgetItem.entity';
import { calculateVariance } from '../utils/budgetCalculator';
import { AuditLogService } from './auditLog.service';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetItem) private readonly repo: Repository<BudgetItem>,
    private readonly auditLog: AuditLogService
  ) {}

  findAll() {
    return this.repo.find({ relations: ['project'], order: { category: 'ASC' } });
  }

  async adjustActualCost(id: string, actualCost: number, userId: string) {
    const item = await this.repo.findOneByOrFail({ id });
    item.actualCost = actualCost;
    item.variance = calculateVariance(Number(item.budgetAmount), actualCost);
    await this.auditLog.record({ userId, action: 'adjust_budget', entity: 'BudgetItem', entityId: id });
    return this.repo.save(item);
  }
}
