import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DesignReviewAction } from '../types/enums';
import { DesignPhase } from './designPhase.entity';

@Entity('design_version_records')
export class DesignVersionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phaseId: string;

  @ManyToOne(() => DesignPhase, (phase) => phase.versionRecords, { onDelete: 'CASCADE' })
  phase: DesignPhase;

  @Column()
  version: number;

  @Column({ type: 'enum', enum: DesignReviewAction })
  action: DesignReviewAction;

  @Column()
  operatorId: string;

  @Column('text', { nullable: true })
  comment?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('simple-json', { nullable: true })
  fileUrls?: string[];

  @CreateDateColumn()
  createdAt: Date;
}
