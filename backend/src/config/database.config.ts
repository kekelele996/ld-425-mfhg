import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RenovationProject } from '../models/project.entity';
import { DesignPhase } from '../models/designPhase.entity';
import { MaterialItem } from '../models/materialItem.entity';
import { BudgetItem } from '../models/budgetItem.entity';
import { ConstructionNode } from '../models/constructionNode.entity';
import { AuditLog } from '../models/auditLog.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'renovation',
  password: process.env.DB_PASSWORD ?? 'renovation123',
  database: process.env.DB_NAME ?? 'home_renovation',
  entities: [RenovationProject, DesignPhase, MaterialItem, BudgetItem, ConstructionNode, AuditLog],
  synchronize: true,
  logging: false
};
