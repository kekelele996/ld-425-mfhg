import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConstructionService } from '../services/construction.service';
import { AcceptanceStatus } from '../types/enums';
import { ok } from '../utils/response';

@Controller('construction')
export class ConstructionController {
  constructor(private readonly service: ConstructionService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Post(':id/inspect')
  async inspect(
    @Param('id') id: string,
    @Body() body: { acceptanceStatus: AcceptanceStatus; acceptanceNote: string; photos: string[] },
    @Req() req: Request
  ) {
    return ok(await this.service.inspect(id, body.acceptanceStatus, body.acceptanceNote, body.photos, req.user?.id ?? 'demo-contractor'));
  }
}
