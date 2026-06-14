import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ItemType, ReservationStatus } from '../types/enums';

@Entity('reservations')
export class Reservation {
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

  @Column('decimal', { precision: 12, scale: 3, default: 0 })
  fulfilledQuantity!: number;

  @Column({ type: 'timestamptz' })
  experimentDate!: Date;

  @Column()
  purpose!: string;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.Pending })
  status!: ReservationStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fulfilledAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt?: Date;
}
