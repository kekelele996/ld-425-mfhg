import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PhaseStatus } from '../types/enums';
import { RenovationProject } from './project.entity';
import { DesignVersion } from './designVersion.entity';

@Entity('design_phases')
export class DesignPhase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => RenovationProject, (project) => project.designPhases, { onDelete: 'CASCADE' })
  project: RenovationProject;

  @Column()
  name: string;

  @Column()
  designerId: string;

  @Column({ type: 'enum', enum: PhaseStatus })
  status: PhaseStatus;

  @Column()
  version: number;

  @Column('text')
  description: string;

  @Column('simple-json')
  fileUrls: string[];

  @Column('text', { nullable: true })
  reviewComment?: string;

  @Column({ nullable: true })
  reviewerId?: string;

  /** 审核通过后锁定，锁定版本不允许再次提交/审核 */
  @Column({ default: false })
  locked: boolean;

  /** 当前待审 / 已审版本（每次提交指向最新快照） */
  @Column({ nullable: true })
  currentVersionId?: string;

  @OneToMany(() => DesignVersion, (designVersion) => designVersion.phase)
  versions: DesignVersion[];
}
