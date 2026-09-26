import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseStatus } from '../types/enums';
import { RenovationProject } from './project.entity';

@Entity('material_items')
export class MaterialItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => RenovationProject, (project) => project.materials, { onDelete: 'CASCADE' })
  project: RenovationProject;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  spec: string;

  @Column()
  brand: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: PurchaseStatus })
  purchaseStatus: PurchaseStatus;

  @Column()
  supplier: string;

  @Column()
  room: string;
}
