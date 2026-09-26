import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstructionNode } from '../models/constructionNode.entity';
import { AcceptanceStatus } from '../types/enums';
import { AuditLogService } from './auditLog.service';

@Injectable()
export class ConstructionService {
  constructor(
    @InjectRepository(ConstructionNode) private readonly repo: Repository<ConstructionNode>,
    private readonly auditLog: AuditLogService
  ) {}

  findAll() {
    return this.repo.find({ relations: ['project'], order: { plannedStartDate: 'ASC' } });
  }

  async inspect(id: string, acceptanceStatus: AcceptanceStatus, acceptanceNote: string, photos: string[], userId: string) {
    const node = await this.repo.findOneByOrFail({ id });
    node.acceptanceStatus = acceptanceStatus;
    node.acceptanceNote = acceptanceNote;
    node.acceptancePhotoUrls = photos;
    await this.auditLog.record({ userId, action: 'inspect_construction', entity: 'ConstructionNode', entityId: id });
    return this.repo.save(node);
  }
}
