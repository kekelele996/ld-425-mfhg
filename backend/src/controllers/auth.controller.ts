import { Body, Controller, Post } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { UserRole } from '../types/enums';
import { RequestUser } from '../types/interfaces';
import { ok } from '../utils/response';

/**
 * 开发环境演示登录：按预置身份签发 JWT，供前端切换业主/设计师视角。
 * 生产环境应替换为账号密码校验的真实登录。
 */
const demoUsers: Record<string, RequestUser> = {
  'owner-001': { id: 'owner-001', role: UserRole.Owner, name: '业主 · 林女士' },
  'designer-001': { id: 'designer-001', role: UserRole.Designer, name: '设计师 · 周工' },
  'contractor-001': { id: 'contractor-001', role: UserRole.Contractor, name: '施工队长 · 王师傅' },
  'pm-001': { id: 'pm-001', role: UserRole.ProjectManager, name: '项目经理 · Demo' }
};

@Controller('auth')
export class AuthController {
  @Post('dev-token')
  devToken(@Body() body: { userId?: string }) {
    const user = demoUsers[body.userId ?? 'owner-001'] ?? demoUsers['owner-001'];
    const token = jwt.sign(user, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return ok({ token, user });
  }
}
