import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { MaterialService } from '../services/material.service';
import { PurchaseStatus } from '../types/enums';
import { ok } from '../utils/response';

@Controller('materials')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { purchaseStatus: PurchaseStatus }, @Req() req: Request) {
    return ok(await this.service.updateStatus(id, body.purchaseStatus, req.user?.id ?? 'demo-manager'));
  }
}
