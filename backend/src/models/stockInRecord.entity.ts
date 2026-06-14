import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemType, QCResult } from '../types/enums';
import { Reagent } from './reagent.entity';

@Entity('stock_in_records')
export class StockInRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  itemId!: string;

  @Column({ type: 'enum', enum: ItemType })
  itemType!: ItemType;

  @Column('decimal', { precision: 12, scale: 3 })
  quantity!: number;

  @Column()
  batchNumber!: string;

  @Column({ type: 'date', nullable: true })
  productionDate?: string;

  @Column({ type: 'date', nullable: true })
  expirationDate?: string;

  @Column()
  purchaseOrderNo!: string;

  @Column()
  operatorId!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  stockInDate!: Date;

  @Column({ type: 'enum', enum: QCResult, default: QCResult.Skip })
  qcResult!: QCResult;

  @ManyToOne(() => Reagent, (reagent) => reagent.stockIns, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'itemId' })
  reagent?: Reagent;
}
