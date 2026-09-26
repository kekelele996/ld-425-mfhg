import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetItem } from '../../models/budgetItem.entity';
import { ConstructionNode } from '../../models/constructionNode.entity';
import { DesignPhase } from '../../models/designPhase.entity';
import { DesignVersion } from '../../models/designVersion.entity';
import { MaterialItem } from '../../models/materialItem.entity';
import { RenovationProject } from '../../models/project.entity';
import { AcceptanceStatus, BudgetCategory, ConstructionPhase, DecorStyle, DesignReviewResult, HouseType, PhaseStatus, ProjectStatus, PurchaseStatus } from '../../types/enums';
import { calculateMaterialTotal, calculateVariance } from '../../utils/budgetCalculator';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(RenovationProject) private readonly projectRepo: Repository<RenovationProject>,
    @InjectRepository(DesignPhase) private readonly designRepo: Repository<DesignPhase>,
    @InjectRepository(DesignVersion) private readonly designVersionRepo: Repository<DesignVersion>,
    @InjectRepository(MaterialItem) private readonly materialRepo: Repository<MaterialItem>,
    @InjectRepository(BudgetItem) private readonly budgetRepo: Repository<BudgetItem>,
    @InjectRepository(ConstructionNode) private readonly constructionRepo: Repository<ConstructionNode>
  ) {}

  async ensureSeedData() {
    if (await this.projectRepo.count()) {
      return;
    }
    const project = await this.projectRepo.save(this.projectRepo.create({
      name: '青梧里 12-803 全屋改造',
      houseType: HouseType.ThreeRoom,
      area: 118,
      decorStyle: DecorStyle.Nordic,
      address: '杭州市西湖区青梧里',
      ownerId: 'owner-001',
      designerId: 'designer-001',
      contractorId: 'contractor-001',
      status: ProjectStatus.InProgress,
      contractAmount: 368000,
      startDate: '2026-05-01',
      expectedEndDate: '2026-09-18'
    }));

    const approvedPhase = this.designRepo.create({ projectId: project.id, name: '方案设计', designerId: 'designer-001', status: PhaseStatus.Approved, version: 3, description: '开放式客餐厅与收纳墙方案。', fileUrls: ['/uploads/design-plan.pdf'], reviewComment: '通过，厨房动线保留。', reviewerId: 'owner-001', locked: true });
    const pendingPhase = this.designRepo.create({ projectId: project.id, name: '施工图', designerId: 'designer-001', status: PhaseStatus.InProgress, version: 0, description: '水电点位和吊顶节点深化中。', fileUrls: ['/uploads/construction-v1.pdf'] });
    const savedPhases = await this.designRepo.save([approvedPhase, pendingPhase]);
    const savedApprovedPhase = savedPhases[0];

    // 已通过阶段补一条历史版本快照，演示版本记录可沿时间线查看
    const approvedSnapshot = this.designVersionRepo.create({
      phaseId: savedApprovedPhase.id,
      version: 3,
      description: savedApprovedPhase.description,
      fileUrls: savedApprovedPhase.fileUrls,
      submittedById: 'designer-001',
      submittedByName: '设计师 · 周工',
      submitComment: '第三版按业主意见调整了厨房动线。',
      reviewResult: DesignReviewResult.Approved,
      reviewerId: 'owner-001',
      reviewerName: '业主 · 林女士',
      reviewComment: '通过，厨房动线保留。',
      submittedAt: new Date('2026-05-12T10:00:00Z'),
      reviewedAt: new Date('2026-05-14T15:30:00Z')
    });
    savedApprovedPhase.currentVersionId = approvedSnapshot.id;
    await Promise.all([
      this.designVersionRepo.save(approvedSnapshot),
      this.designRepo.save(savedApprovedPhase)
    ]);

    await this.materialRepo.save([
      this.materialRepo.create({ projectId: project.id, name: '客厅木纹砖', category: '瓷砖', spec: '900x1800mm', brand: 'Monalisa', quantity: 48, unit: '片', unitPrice: 218, totalPrice: calculateMaterialTotal(48, 218), purchaseStatus: PurchaseStatus.Delivered, supplier: '城市建材仓', room: '客厅' }),
      this.materialRepo.create({ projectId: project.id, name: '哑光乳胶漆', category: '油漆', spec: '18L', brand: 'Nippon', quantity: 8, unit: '桶', unitPrice: 560, totalPrice: calculateMaterialTotal(8, 560), purchaseStatus: PurchaseStatus.Ordered, supplier: '安心涂料', room: '卧室' })
    ]);

    await this.budgetRepo.save([
      this.budgetRepo.create({ projectId: project.id, category: BudgetCategory.Design, budgetAmount: 32000, actualCost: 32000, variance: calculateVariance(32000, 32000), note: '含效果图与施工图' }),
      this.budgetRepo.create({ projectId: project.id, category: BudgetCategory.Material, budgetAmount: 168000, actualCost: 153200, variance: calculateVariance(168000, 153200), note: '主材已完成 72%' }),
      this.budgetRepo.create({ projectId: project.id, category: BudgetCategory.Labor, budgetAmount: 98000, actualCost: 104500, variance: calculateVariance(98000, 104500), note: '水电增项导致超支' })
    ]);

    await this.constructionRepo.save([
      this.constructionRepo.create({ projectId: project.id, name: ConstructionPhase.Demolition, plannedStartDate: '2026-05-01', plannedEndDate: '2026-05-08', actualStartDate: '2026-05-01', actualEndDate: '2026-05-07', status: 'Completed', acceptanceStatus: AcceptanceStatus.Passed, acceptancePhotoUrls: ['/uploads/demolition.jpg'], acceptanceNote: '拆改完成，垃圾清运合格。' }),
      this.constructionRepo.create({ projectId: project.id, name: ConstructionPhase.Plumbing, plannedStartDate: '2026-05-09', plannedEndDate: '2026-05-24', actualStartDate: '2026-05-10', status: 'Delayed', acceptanceStatus: AcceptanceStatus.Pending, acceptancePhotoUrls: [], acceptanceNote: '等待水压测试。' }),
      this.constructionRepo.create({ projectId: project.id, name: ConstructionPhase.Carpentry, plannedStartDate: '2026-05-25', plannedEndDate: '2026-06-12', status: 'Pending', acceptanceStatus: AcceptanceStatus.Pending, acceptancePhotoUrls: [], acceptanceNote: '材料到场后开工。' })
    ]);
  }
}
