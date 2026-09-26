import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DesignReviewResult } from '../types/enums';
import { DesignPhase } from './designPhase.entity';

/**
 * 设计版本快照：设计师每次提交时生成一条不可变快照，
 * 业主在该快照上审核（通过锁定 / 驳回进入修改）。
 */
@Entity('design_versions')
export class DesignVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phaseId: string;

  @ManyToOne(() => DesignPhase, (phase) => phase.versions, { onDelete: 'CASCADE' })
  phase: DesignPhase;

  @Column()
  version: number;

  @Column('text')
  description: string;

  @Column('simple-json')
  fileUrls: string[];

  @Column()
  submittedById: string;

  @Column({ nullable: true })
  submittedByName?: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column('text', { nullable: true })
  submitComment?: string;

  @Column({ type: 'enum', enum: DesignReviewResult, nullable: true })
  reviewResult?: DesignReviewResult;

  @Column({ nullable: true })
  reviewerId?: string;

  @Column({ nullable: true })
  reviewerName?: string;

  @Column('text', { nullable: true })
  reviewComment?: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;
}
