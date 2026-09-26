import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../types/enums';

/**
 * 基于角色的接口访问守卫：未认证返回 401，角色不匹配返回 403。
 * 例如审核接口只挂载 [UserRole.Owner]，非业主调用一律拒绝。
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly roles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.user) {
      throw new UnauthorizedException('请先登录');
    }
    if (!this.roles.includes(req.user.role)) {
      throw new ForbiddenException('当前角色无权执行该操作');
    }
    return true;
  }
}
