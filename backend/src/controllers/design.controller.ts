import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { DesignService } from '../services/design.service';
import { UserRole } from '../types/enums';
import { RbacGuard } from '../middlewares/rbac.guard';
import { ok } from '../utils/response';

@Controller('designs')
export class DesignController {
  constructor(private readonly service: DesignService) {}

  @Get()
  async list() {
    return ok(await this.service.findAll());
  }

  @Get(':id/versions')
  async versions(@Param('id') id: string) {
    return ok(await this.service.findVersions(id));
  }

  @Post(':id/submit')
  @UseGuards(new RbacGuard([UserRole.Designer, UserRole.Admin]))
  async submit(
    @Param('id') id: string,
    @Body() body: { description?: string; fileUrls?: string[]; comment?: string },
    @Req() req: Request
  ) {
    return ok(await this.service.submit(id, req.user!, body));
  }

  @Post(':id/review')
  @UseGuards(new RbacGuard([UserRole.Owner]))
  async review(
    @Param('id') id: string,
    @Body() body: { approved: boolean; comment: string },
    @Req() req: Request
  ) {
    return ok(await this.service.review(id, body.approved, body.comment, req.user!));
  }
}
