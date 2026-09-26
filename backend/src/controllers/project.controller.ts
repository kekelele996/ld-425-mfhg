import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { ok } from '../utils/response';
import { RenovationProject } from '../models/project.entity';
import { Request } from 'express';

@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Post()
  async create(@Body() body: Partial<RenovationProject>, @Req() req: Request) {
    return ok(await this.service.create(body), `项目已由 ${req.user?.name ?? 'system'} 创建`);
  }
}
