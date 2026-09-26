import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DesignPhase } from '../models/designPhase.entity';
import { DesignVersion } from '../models/designVersion.entity';
import { RenovationProject } from '../models/project.entity';
import { DesignReviewResult, PhaseStatus, UserRole } from '../types/enums';
import { RequestUser } from '../types/interfaces';
import { AuditLogService } from './auditLog.service';

export interface SubmitDesignInput {
  description?: string;
  fileUrls?: string[];
  comment?: string;
}

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(DesignPhase) private readonly repo: Repository<DesignPhase>,
    @InjectRepository(DesignVersion) private readonly versionRepo: Repository<DesignVersion>,
    @InjectRepository(RenovationProject) private readonly projectRepo: Repository<RenovationProject>,
    private readonly auditLog: AuditLogService,
    private readonly dataSource: DataSource
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['project'],
      order: { projectId: 'ASC', name: 'ASC', version: 'DESC' }
    });
  }

  /** 沿版本查看某个设计阶段的提交/审核记录 */
  async findVersions(phaseId: string) {
    const phase = await this.repo.findOne({ where: { id: phaseId }, relations: ['project'] });
    if (!phase) {
      throw new NotFoundException('设计阶段不存在');
    }
    const versions = await this.versionRepo.find({
      where: { phaseId },
      order: { version: 'DESC' }
    });
    return { phase, versions };
  }

  /** 设计师提交方案：留下新版本快照，阶段进入待审核 */
  async submit(id: string, user: RequestUser, input: SubmitDesignInput = {}) {
    return this.dataSource.transaction(async (manager) => {
      const phaseRepo = manager.getRepository(DesignPhase);
      const versionRepo = manager.getRepository(DesignVersion);

      const phase = await phaseRepo.findOneBy({ id });
      if (!phase) {
        throw new NotFoundException('设计阶段不存在');
      }
      if (phase.locked || phase.status === PhaseStatus.Approved) {
        throw new ConflictException('该版本已审核通过并锁定，无法再次提交');
      }
      if (phase.status === PhaseStatus.Submitted) {
        throw new ConflictException('方案已提交，等待业主审核，不能重复提交');
      }
      if (user.role !== UserRole.Admin && phase.designerId !== user.id) {
        throw new ForbiddenException('只有负责该阶段的设计师可以提交方案');
      }

      const description = input.description ?? phase.description;
      const fileUrls = input.fileUrls ?? phase.fileUrls;
      const snapshot = versionRepo.create({
        phaseId: phase.id,
        version: phase.version + 1,
        description,
        fileUrls,
        submittedById: user.id,
        submittedByName: user.name,
        submitComment: input.comment?.trim() || undefined
      });
      const savedVersion = await versionRepo.save(snapshot);

      phase.version = snapshot.version;
      phase.description = description;
      phase.fileUrls = fileUrls;
      phase.status = PhaseStatus.Submitted;
      phase.currentVersionId = savedVersion.id;
      phase.reviewComment = undefined;
      phase.reviewerId = undefined;
      const savedPhase = await phaseRepo.save(phase);

      await this.auditLog.record({
        userId: user.id,
        action: 'submit_design',
        entity: 'DesignPhase',
        entityId: phase.id,
        comment: input.comment?.trim() || `提交 v${snapshot.version} 方案`
      });

      return { phase: savedPhase, version: savedVersion };
    });
  }

  /** 业主审核提交中的方案：通过锁定，驳回进入修改 */
  async review(id: string, approved: boolean, comment: string, user: RequestUser) {
    const opinion = comment?.trim();
    if (!opinion) {
      throw new BadRequestException('审核意见不能为空');
    }

    return this.dataSource.transaction(async (manager) => {
      const phaseRepo = manager.getRepository(DesignPhase);
      const versionRepo = manager.getRepository(DesignVersion);

      const phase = await phaseRepo.findOne({ where: { id }, relations: ['project'] });
      if (!phase) {
        throw new NotFoundException('设计阶段不存在');
      }

      // 角色 + 项目归属双重校验：只有项目业主本人可以审核
      const project = await this.projectRepo.findOneByOrFail({ id: phase.projectId });
      if (user.role !== UserRole.Admin && !(user.role === UserRole.Owner && project.ownerId === user.id)) {
        throw new ForbiddenException('只有业主可以审核设计方案');
      }

      if (phase.locked || phase.status === PhaseStatus.Approved) {
        throw new ConflictException('该版本已审核通过并锁定，不能重复审核');
      }
      if (phase.status !== PhaseStatus.Submitted || !phase.currentVersionId) {
        throw new ConflictException('该设计阶段尚未提交，没有待审核的版本');
      }

      const snapshot = await versionRepo.findOneByOrFail({ id: phase.currentVersionId });
      snapshot.reviewResult = approved ? DesignReviewResult.Approved : DesignReviewResult.Rejected;
      snapshot.reviewerId = user.id;
      snapshot.reviewerName = user.name;
      snapshot.reviewComment = opinion;
      snapshot.reviewedAt = new Date();
      const savedVersion = await versionRepo.save(snapshot);

      phase.status = approved ? PhaseStatus.Approved : PhaseStatus.Revision;
      phase.reviewComment = opinion;
      phase.reviewerId = user.id;
      phase.locked = approved;
      const savedPhase = await phaseRepo.save(phase);

      await this.auditLog.record({
        userId: user.id,
        action: approved ? 'approve_design' : 'reject_design',
        entity: 'DesignPhase',
        entityId: phase.id,
        comment: opinion
      });

      return { phase: savedPhase, version: savedVersion };
    });
  }
}
