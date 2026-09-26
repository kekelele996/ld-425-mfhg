import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { DesignService } from '../services/design.service';
import { RequestUser, SubmitDesignInput } from '../types/interfaces';
import { ok } from '../utils/response';

@Controller('designs')
export class DesignController {
  constructor(private readonly service: DesignService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Get(':id/records')
  async records(@Param('id') id: string) {
    return ok(await this.service.findRecords(id));
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body() body: SubmitDesignInput, @Req() req: Request) {
    return ok(await this.service.submit(id, req.user?.id ?? 'demo-designer', body ?? {}));
  }

  @Post(':id/review')
  async review(@Param('id') id: string, @Body() body: { approved: boolean; comment: string }, @Req() req: Request) {
    return ok(await this.service.review(id, body.approved, body.comment, req.user as RequestUser));
  }
}
