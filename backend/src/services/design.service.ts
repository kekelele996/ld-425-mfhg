import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignPhase } from '../models/designPhase.entity';
import { PhaseStatus } from '../types/enums';
import { AuditLogService } from './auditLog.service';

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(DesignPhase) private readonly repo: Repository<DesignPhase>,
    private readonly auditLog: AuditLogService
  ) {}

  findAll() {
    return this.repo.find({ relations: ['project'], order: { version: 'DESC' } });
  }

  async submit(id: string, userId: string) {
    const phase = await this.repo.findOneByOrFail({ id });
    phase.status = PhaseStatus.InProgress;
    phase.version += 1;
    await this.auditLog.record({ userId, action: 'submit_design', entity: 'DesignPhase', entityId: id });
    return this.repo.save(phase);
  }

  async review(id: string, approved: boolean, comment: string, reviewerId: string) {
    const phase = await this.repo.findOneByOrFail({ id });
    phase.status = approved ? PhaseStatus.Approved : PhaseStatus.Revision;
    phase.reviewComment = comment;
    phase.reviewerId = reviewerId;
    await this.auditLog.record({ userId: reviewerId, action: approved ? 'approve_design' : 'reject_design', entity: 'DesignPhase', entityId: id });
    return this.repo.save(phase);
  }
}
