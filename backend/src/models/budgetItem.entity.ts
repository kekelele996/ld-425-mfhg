import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetCategory } from '../types/enums';
import { RenovationProject } from './project.entity';

@Entity('budget_items')
export class BudgetItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => RenovationProject, (project) => project.budgets, { onDelete: 'CASCADE' })
  project: RenovationProject;

  @Column({ type: 'enum', enum: BudgetCategory })
  category: BudgetCategory;

  @Column('decimal', { precision: 12, scale: 2 })
  budgetAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  actualCost: number;

  @Column('decimal', { precision: 12, scale: 2 })
  variance: number;

  @Column('text')
  note: string;
}
