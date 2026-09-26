import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ProjectController } from './controllers/project.controller';
import { DesignController } from './controllers/design.controller';
import { MaterialController } from './controllers/material.controller';
import { BudgetController } from './controllers/budget.controller';
import { ConstructionController } from './controllers/construction.controller';
import { HealthController } from './controllers/health.controller';
import { RenovationProject } from './models/project.entity';
import { DesignPhase } from './models/designPhase.entity';
import { MaterialItem } from './models/materialItem.entity';
import { BudgetItem } from './models/budgetItem.entity';
import { ConstructionNode } from './models/constructionNode.entity';
import { AuditLog } from './models/auditLog.entity';
import { ProjectService } from './services/project.service';
import { DesignService } from './services/design.service';
import { MaterialService } from './services/material.service';
import { BudgetService } from './services/budget.service';
import { ConstructionService } from './services/construction.service';
import { AuditLogService } from './services/auditLog.service';
import { SeedService } from './database/seeds/seed.service';
import { authMiddleware } from './middlewares/auth.middleware';
import { auditLogMiddleware } from './middlewares/auditLog.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([RenovationProject, DesignPhase, MaterialItem, BudgetItem, ConstructionNode, AuditLog])
  ],
  controllers: [HealthController, ProjectController, DesignController, MaterialController, BudgetController, ConstructionController],
  providers: [ProjectService, DesignService, MaterialService, BudgetService, ConstructionService, AuditLogService, SeedService]
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly seedService: SeedService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware, auditLogMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    await this.seedService.ensureSeedData();
  }
}
