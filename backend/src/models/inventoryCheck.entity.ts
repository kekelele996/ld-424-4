import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryCheckStatus } from '../types/enums';
import { InventoryCheckItem } from './inventoryCheckItem.entity';

@Entity('inventory_checks')
export class InventoryCheck {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  checkDate!: Date;

  @Column()
  checkerId!: string;

  @Column({ type: 'enum', enum: InventoryCheckStatus, default: InventoryCheckStatus.InProgress })
  status!: InventoryCheckStatus;

  @Column()
  scopeDescription!: string;

  @OneToMany(() => InventoryCheckItem, (item) => item.inventoryCheck, { cascade: true })
  items!: InventoryCheckItem[];
}
