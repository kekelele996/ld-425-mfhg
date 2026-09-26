/**
 * HTTP 层测试：验证审核/提交接口的角色守卫
 * - 未带 token（默认项目经理身份）调审核接口 -> 403
 * - 设计师身份调审核接口 -> 403
 * - 业主身份调审核接口 -> 放行
 * - 业主身份调提交接口 -> 403
 */
import 'reflect-metadata';
import { Controller, Module, Post, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import jwt from 'jsonwebtoken';
import { DesignController } from '../src/controllers/design.controller';
import { DesignService } from '../src/services/design.service';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { jwtConfig } from '../src/config/jwt.config';
import { UserRole } from '../src/types/enums';

const mockService = {
  findAll: async () => [],
  findVersions: async () => ({ phase: {}, versions: [] }),
  submit: async () => ({ phase: {}, version: {} }),
  review: async () => ({ phase: {}, version: {} })
};

@Module({
  controllers: [DesignController],
  providers: [{ provide: DesignService, useValue: mockService }]
})
class TestModule {}

let failures = 0;
function check(name: string, actual: number, expected: number) {
  if (actual === expected) {
    console.log(`  PASS ${name} (${actual})`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name} expected=${expected} actual=${actual}`);
  }
}

function token(role: UserRole, id = 'owner-001') {
  return jwt.sign({ id, role, name: id }, jwtConfig.secret);
}

async function main() {
  const app: INestApplication = await NestFactory.create(TestModule, { logger: false });
  app.setGlobalPrefix('api');
  app.use(authMiddleware);
  await app.listen(0);
  const address = app.getHttpServer().address();
  const base = `http://127.0.0.1:${address.port}/api/designs`;

  const post = (path: string, auth?: string) =>
    fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
      body: JSON.stringify({ approved: true, comment: 'ok' })
    }).then((r) => r.status);

  console.log('审核接口 RBAC');
  check('无 token（默认项目经理）审核 -> 403', await post('/p1/review'), 403);
  check('设计师审核 -> 403', await post('/p1/review', token(UserRole.Designer)), 403);
  check('施工队长审核 -> 403', await post('/p1/review', token(UserRole.Contractor)), 403);
  check('业主审核 -> 放行', await post('/p1/review', token(UserRole.Owner)), 201);

  console.log('提交接口 RBAC');
  check('业主提交 -> 403', await post('/p1/submit', token(UserRole.Owner)), 403);
  check('设计师提交 -> 放行', await post('/p1/submit', token(UserRole.Designer)), 201);

  await app.close();
  console.log(failures === 0 ? '\nALL HTTP TESTS PASSED' : `\n${failures} HTTP TEST(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('TEST RUN ERROR', e);
  process.exit(1);
});
