import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DecorStyle, HouseType, ProjectStatus } from '../types/enums';
import { DesignPhase } from './designPhase.entity';
import { MaterialItem } from './materialItem.entity';
import { BudgetItem } from './budgetItem.entity';
import { ConstructionNode } from './constructionNode.entity';

@Entity('renovation_projects')
export class RenovationProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: HouseType })
  houseType: HouseType;

  @Column('decimal', { precision: 8, scale: 2 })
  area: number;

  @Column({ type: 'enum', enum: DecorStyle })
  decorStyle: DecorStyle;

  @Column()
  address: string;

  @Column()
  ownerId: string;

  @Column()
  designerId: string;

  @Column()
  contractorId: string;

  @Column({ type: 'enum', enum: ProjectStatus })
  status: ProjectStatus;

  @Column('decimal', { precision: 12, scale: 2 })
  contractAmount: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  expectedEndDate: string;

  @OneToMany(() => DesignPhase, (phase) => phase.project)
  designPhases: DesignPhase[];

  @OneToMany(() => MaterialItem, (item) => item.project)
  materials: MaterialItem[];

  @OneToMany(() => BudgetItem, (item) => item.project)
  budgets: BudgetItem[];

  @OneToMany(() => ConstructionNode, (node) => node.project)
  constructionNodes: ConstructionNode[];
}
