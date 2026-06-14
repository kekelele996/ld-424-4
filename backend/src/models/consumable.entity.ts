import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ConsumableCategory } from '../types/enums';

@Entity('consumables')
export class Consumable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  model!: string;

  @Column({ type: 'enum', enum: ConsumableCategory, default: ConsumableCategory.Other })
  category!: ConsumableCategory;

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  currentStock!: number;

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  frozenStock!: number;

  @Column()
  unit!: string;

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  minStockThreshold!: number;

  @Column()
  location!: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  unitPrice!: number;
}
