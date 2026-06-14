import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HazardLevel, StorageCondition } from '../types/enums';
import { StockInRecord } from './stockInRecord.entity';
import { UsageRecord } from './usageRecord.entity';

@Entity('reagents')
export class Reagent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  casNumber?: string;

  @Column()
  molecularFormula!: string;

  @Column('decimal', { precision: 10, scale: 3 })
  molecularWeight!: number;

  @Column()
  purityGrade!: string;

  @Column({ type: 'enum', enum: HazardLevel, default: HazardLevel.Safe })
  hazardLevel!: HazardLevel;

  @Column({ type: 'enum', enum: StorageCondition, default: StorageCondition.RoomTemp })
  storageCondition!: StorageCondition;

  @Column()
  supplierId!: string;

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  currentStock!: number;

  @Column()
  unit!: string;

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  minStockThreshold!: number;

  @Column()
  location!: string;

  @Column({ nullable: true })
  msdsUrl?: string;

  @OneToMany(() => StockInRecord, (record) => record.reagent)
  stockIns!: StockInRecord[];

  @OneToMany(() => UsageRecord, (record) => record.reagent)
  usages!: UsageRecord[];
}
