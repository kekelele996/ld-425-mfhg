import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AcceptanceStatus, ConstructionPhase } from '../types/enums';
import { RenovationProject } from './project.entity';

@Entity('construction_nodes')
export class ConstructionNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => RenovationProject, (project) => project.constructionNodes, { onDelete: 'CASCADE' })
  project: RenovationProject;

  @Column({ type: 'enum', enum: ConstructionPhase })
  name: ConstructionPhase;

  @Column({ type: 'date' })
  plannedStartDate: string;

  @Column({ type: 'date' })
  plannedEndDate: string;

  @Column({ type: 'date', nullable: true })
  actualStartDate?: string;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: string;

  @Column()
  status: string;

  @Column({ type: 'enum', enum: AcceptanceStatus })
  acceptanceStatus: AcceptanceStatus;

  @Column('simple-json')
  acceptancePhotoUrls: string[];

  @Column('text')
  acceptanceNote: string;
}
