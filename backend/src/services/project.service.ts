import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RenovationProject } from '../models/project.entity';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(RenovationProject) private readonly repo: Repository<RenovationProject>) {}

  findAll() {
    return this.repo.find({ relations: ['constructionNodes', 'budgets'], order: { startDate: 'DESC' } });
  }

  create(data: Partial<RenovationProject>) {
    return this.repo.save(this.repo.create(data));
  }
}
