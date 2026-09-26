import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { BudgetService } from '../services/budget.service';
import { ok } from '../utils/response';

@Controller('budgets')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Patch(':id/actual-cost')
  async updateActualCost(@Param('id') id: string, @Body() body: { actualCost: number }, @Req() req: Request) {
    return ok(await this.service.adjustActualCost(id, body.actualCost, req.user?.id ?? 'demo-manager'));
  }
}
