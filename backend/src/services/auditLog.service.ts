import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { AuditContext } from '../types/interfaces';

@Injectable()
export class AuditLogService {
  constructor(@InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>) {}

  async record(context: AuditContext) {
    return this.repo.save(this.repo.create(context));
  }
}
