import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemType } from '../types/enums';
import { InventoryCheck } from './inventoryCheck.entity';

@Entity('inventory_check_items')
export class InventoryCheckItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  itemId!: string;

  @Column({ type: 'enum', enum: ItemType })
  itemType!: ItemType;

  @Column('decimal', { precision: 12, scale: 3 })
  systemStock!: number;

  @Column('decimal', { precision: 12, scale: 3 })
  actualStock!: number;

  @Column('decimal', { precision: 12, scale: 3 })
  difference!: number;

  @Column({ nullable: true })
  reason?: string;

  @ManyToOne(() => InventoryCheck, (check) => check.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryCheckId' })
  inventoryCheck!: InventoryCheck;
}
