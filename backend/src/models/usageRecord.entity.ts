import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemType, UsageStatus } from '../types/enums';
import { Reagent } from './reagent.entity';

@Entity('usage_records')
export class UsageRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  itemId!: string;

  @Column({ type: 'enum', enum: ItemType })
  itemType!: ItemType;

  @Column()
  userId!: string;

  @Column('decimal', { precision: 12, scale: 3 })
  quantity!: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  usageDate!: Date;

  @Column({ nullable: true })
  experimentId?: string;

  @Column()
  purpose!: string;

  @Column({ type: 'enum', enum: UsageStatus, default: UsageStatus.Pending })
  approvalStatus!: UsageStatus;

  @Column({ nullable: true })
  approverId?: string;

  @ManyToOne(() => Reagent, (reagent) => reagent.usages, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'itemId' })
  reagent?: Reagent;
}
