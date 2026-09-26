/**
 * 集成测试：用内存 SQLite 验证设计审核全流程
 * 1. 设计师提交 -> 生成新版本快照，状态 Submitted
 * 2. 非业主审核 -> 403 拒绝
 * 3. 业主驳回 -> 状态 Revision，快照留痕
 * 4. 再次提交 -> 版本号递增，新快照
 * 5. 业主通过 -> 状态 Approved + 锁定
 * 6. 锁定后提交/审核 -> 409 拒绝
 * 7. 版本记录接口 -> 沿版本返回完整操作人/时间/意见
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DesignService } from '../src/services/design.service';
import { AuditLogService } from '../src/services/auditLog.service';
import { DesignPhase } from '../src/models/designPhase.entity';
import { DesignVersion } from '../src/models/designVersion.entity';
import { RenovationProject } from '../src/models/project.entity';
import { MaterialItem } from '../src/models/materialItem.entity';
import { BudgetItem } from '../src/models/budgetItem.entity';
import { ConstructionNode } from '../src/models/constructionNode.entity';
import { AuditLog } from '../src/models/auditLog.entity';
import { DecorStyle, DesignReviewResult, HouseType, PhaseStatus, ProjectStatus, UserRole } from '../src/types/enums';
import { RequestUser } from '../src/types/interfaces';

const owner: RequestUser = { id: 'owner-001', role: UserRole.Owner, name: '业主 · 林女士' };
const designer: RequestUser = { id: 'designer-001', role: UserRole.Designer, name: '设计师 · 周工' };
const pm: RequestUser = { id: 'pm-001', role: UserRole.ProjectManager, name: '项目经理' };

let failures = 0;
function check(name: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`  PASS ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}`, detail ?? '');
  }
}

async function main() {
  const dataSource = new DataSource({
    type: 'sqljs',
    autoSave: false,
    synchronize: true,
    entities: [RenovationProject, DesignPhase, DesignVersion, MaterialItem, BudgetItem, ConstructionNode, AuditLog]
  });
  await dataSource.initialize();

  const projectRepo = dataSource.getRepository(RenovationProject);
  const phaseRepo = dataSource.getRepository(DesignPhase);
  const versionRepo = dataSource.getRepository(DesignVersion);
  const auditRepo = dataSource.getRepository(AuditLog);

  const project = await projectRepo.save(projectRepo.create({
    name: '测试项目', houseType: HouseType.ThreeRoom, area: 100, decorStyle: DecorStyle.Nordic,
    address: '测试地址', ownerId: 'owner-001', designerId: 'designer-001', contractorId: 'contractor-001',
    status: ProjectStatus.Designing, contractAmount: 100000, startDate: '2026-01-01', expectedEndDate: '2026-06-01'
  }));
  const phase = await phaseRepo.save(phaseRepo.create({
    projectId: project.id, name: '方案设计', designerId: 'designer-001',
    status: PhaseStatus.InProgress, version: 1, description: '初稿', fileUrls: ['/a.pdf'], locked: false
  }));

  const auditLogService = new AuditLogService(auditRepo as never);
  const service = new DesignService(
    phaseRepo as never, versionRepo as never, projectRepo as never, auditLogService, dataSource
  );

  console.log('1. 设计师提交方案');
  const submitted = await service.submit(phase.id, designer, { comment: '第一版提交' });
  check('状态变为 Submitted', submitted.phase.status === PhaseStatus.Submitted);
  check('版本号递增到 2', submitted.phase.version === 2);
  check('生成快照', submitted.version.version === 2 && submitted.version.phaseId === phase.id);
  check('快照记录提交人', submitted.version.submittedById === 'designer-001' && submitted.version.submittedByName === '设计师 · 周工');
  check('快照记录提交时间', submitted.version.submittedAt instanceof Date);
  check('快照记录提交意见', submitted.version.submitComment === '第一版提交');

  console.log('2. 提交中不可重复提交');
  let err: Error | null = null;
  try { await service.submit(phase.id, designer, {}); } catch (e) { err = e as Error; }
  check('重复提交被拒绝', err !== null && err.constructor.name === 'ConflictException', err?.message);

  console.log('3. 非业主审核被拒绝');
  err = null;
  try { await service.review(phase.id, true, '通过', pm); } catch (e) { err = e as Error; }
  check('项目经理审核 -> 403', err !== null && err.constructor.name === 'ForbiddenException', err?.message);
  err = null;
  try { await service.review(phase.id, true, '通过', designer); } catch (e) { err = e as Error; }
  check('设计师审核 -> 403', err !== null && err.constructor.name === 'ForbiddenException', err?.message);
  err = null;
  try { await service.review(phase.id, true, '通过', { ...owner, id: 'owner-999' }); } catch (e) { err = e as Error; }
  check('非本项目的业主审核 -> 403', err !== null && err.constructor.name === 'ForbiddenException', err?.message);

  console.log('4. 审核意见必填');
  err = null;
  try { await service.review(phase.id, true, '   ', owner); } catch (e) { err = e as Error; }
  check('空意见 -> 400', err !== null && err.constructor.name === 'BadRequestException', err?.message);

  console.log('5. 业主驳回 -> 进入修改');
  const rejected = await service.review(phase.id, false, '收纳比例需要调整', owner);
  check('状态变为 Revision', rejected.phase.status === PhaseStatus.Revision);
  check('快照记录驳回', rejected.version.reviewResult === DesignReviewResult.Rejected);
  check('快照记录审核人/意见', rejected.version.reviewerId === 'owner-001' && rejected.version.reviewComment === '收纳比例需要调整');
  check('快照记录审核时间', rejected.version.reviewedAt instanceof Date);

  console.log('6. 驳回后再次提交 -> 新快照 v3');
  const resubmitted = await service.submit(phase.id, designer, { comment: '已调整收纳比例' });
  check('版本号递增到 3', resubmitted.version.version === 3);
  check('重新进入待审核', resubmitted.phase.status === PhaseStatus.Submitted);

  console.log('7. 业主通过 -> 锁定');
  const approved = await service.review(phase.id, true, '方案确认通过', owner);
  check('状态变为 Approved', approved.phase.status === PhaseStatus.Approved);
  check('阶段锁定', approved.phase.locked === true);
  check('快照记录通过', approved.version.reviewResult === DesignReviewResult.Approved);

  console.log('8. 锁定后不可再提交/审核');
  err = null;
  try { await service.submit(phase.id, designer, {}); } catch (e) { err = e as Error; }
  check('锁定后提交 -> 409', err !== null && err.constructor.name === 'ConflictException', err?.message);
  err = null;
  try { await service.review(phase.id, false, '再驳回', owner); } catch (e) { err = e as Error; }
  check('锁定后审核 -> 409', err !== null && err.constructor.name === 'ConflictException', err?.message);

  console.log('9. 版本记录沿版本可查');
  const history = await service.findVersions(phase.id);
  check('共 2 条版本记录', history.versions.length === 2);
  check('按版本倒序', history.versions[0].version === 3 && history.versions[1].version === 2);
  check('v2 记录驳回留痕', history.versions[1].reviewResult === DesignReviewResult.Rejected && history.versions[1].reviewComment === '收纳比例需要调整');
  check('v3 记录通过留痕', history.versions[0].reviewResult === DesignReviewResult.Approved && history.versions[0].reviewerName === '业主 · 林女士');

  console.log('10. 操作日志留痕（提交/驳回/通过 + 意见）');
  const logs = await auditRepo.find({ order: { createdAt: 'ASC' } });
  const actions = logs.map((l) => l.action);
  check('日志含提交/驳回/通过', actions.includes('submit_design') && actions.includes('reject_design') && actions.includes('approve_design'), actions.join(','));
  const rejectLog = logs.find((l) => l.action === 'reject_design');
  check('驳回日志带操作人与意见', rejectLog?.userId === 'owner-001' && rejectLog?.comment === '收纳比例需要调整');
  const submitLog = logs.find((l) => l.action === 'submit_design');
  check('提交日志带操作人与意见', submitLog?.userId === 'designer-001' && submitLog?.comment === '第一版提交');

  await dataSource.destroy();
  console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('TEST RUN ERROR', e);
  process.exit(1);
});
