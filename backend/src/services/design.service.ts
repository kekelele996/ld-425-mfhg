import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignPhase } from '../models/designPhase.entity';
import { DesignVersionRecord } from '../models/designVersionRecord.entity';
import { DesignReviewAction, PhaseStatus, UserRole } from '../types/enums';
import { RequestUser, SubmitDesignInput } from '../types/interfaces';
import { AuditLogService } from './auditLog.service';

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(DesignPhase) private readonly repo: Repository<DesignPhase>,
    @InjectRepository(DesignVersionRecord) private readonly recordRepo: Repository<DesignVersionRecord>,
    private readonly auditLog: AuditLogService
  ) {}

  findAll() {
    return this.repo.find({ relations: ['project'], order: { version: 'DESC' } });
  }

  findRecords(phaseId: string) {
    return this.recordRepo.find({ where: { phaseId }, order: { version: 'DESC', createdAt: 'ASC' } });
  }

  async submit(id: string, userId: string, input: SubmitDesignInput) {
    const phase = await this.repo.findOneByOrFail({ id });
    if (phase.status !== PhaseStatus.NotStarted && phase.status !== PhaseStatus.Revision) {
      throw new BadRequestException('当前状态不可提交，仅未开始或修改中的阶段可以提交');
    }
    phase.version += 1;
    phase.status = PhaseStatus.InProgress;
    if (input.description !== undefined) {
      phase.description = input.description;
    }
    if (input.fileUrls !== undefined) {
      phase.fileUrls = input.fileUrls;
    }
    const saved = await this.repo.save(phase);
    await this.recordRepo.save(this.recordRepo.create({
      phaseId: saved.id,
      version: saved.version,
      action: DesignReviewAction.Submit,
      operatorId: userId,
      comment: input.comment,
      description: saved.description,
      fileUrls: saved.fileUrls
    }));
    await this.auditLog.record({ userId, action: 'submit_design', entity: 'DesignPhase', entityId: id });
    return saved;
  }

  async review(id: string, approved: boolean, comment: string, reviewer: RequestUser) {
    if (reviewer.role !== UserRole.Owner) {
      throw new ForbiddenException('只有业主可以审核设计方案');
    }
    const phase = await this.repo.findOneByOrFail({ id });
    if (phase.status !== PhaseStatus.InProgress) {
      throw new BadRequestException('仅提交中的方案可以审核');
    }
    phase.status = approved ? PhaseStatus.Approved : PhaseStatus.Revision;
    phase.reviewComment = comment;
    phase.reviewerId = reviewer.id;
    const saved = await this.repo.save(phase);
    await this.recordRepo.save(this.recordRepo.create({
      phaseId: saved.id,
      version: saved.version,
      action: approved ? DesignReviewAction.Approve : DesignReviewAction.Reject,
      operatorId: reviewer.id,
      comment
    }));
    await this.auditLog.record({ userId: reviewer.id, action: approved ? 'approve_design' : 'reject_design', entity: 'DesignPhase', entityId: id });
    return saved;
  }
}
