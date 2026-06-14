import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Reservation } from '../models/reservation.entity';
import { HazardLevel, ItemType, ReservationStatus, Role } from '../types/enums';
import { AuthUser } from '../types/interfaces';
import { AuditService } from './audit.service';
import { ConsumableService } from './consumable.service';
import { ReagentService } from './reagent.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation) private readonly repo: Repository<Reservation>,
    private readonly reagents: ReagentService,
    private readonly consumables: ConsumableService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const reservation = await this.repo.findOneBy({ id });
    if (!reservation) throw new NotFoundException('预约记录不存在');
    return reservation;
  }

  private async getAvailableStock(itemId: string, itemType: ItemType) {
    if (itemType === ItemType.Reagent) {
      const reagent = await this.reagents.findOne(itemId);
      return Number(reagent.currentStock) - Number(reagent.frozenStock);
    }
    const consumable = await this.consumables.findOne(itemId);
    return Number(consumable.currentStock) - Number(consumable.frozenStock);
  }

  async create(payload: Partial<Reservation> & Record<string, unknown>, user: AuthUser) {
    const quantity = Number(payload.quantity ?? 0);
    const itemType = payload.itemType as ItemType;
    const itemId = String(payload.itemId);
    const experimentDate = payload.experimentDate ? new Date(String(payload.experimentDate)) : new Date();

    const available = await this.getAvailableStock(itemId, itemType);
    if (available < quantity) {
      throw new BadRequestException(`可用库存不足，当前可用: ${available}，申请数量: ${quantity}`);
    }

    if (itemType === ItemType.Reagent) {
      const reagent = await this.reagents.findOne(itemId);
      if ([HazardLevel.Toxic, HazardLevel.Explosive].includes(reagent.hazardLevel) && user.role === Role.Student) {
        throw new BadRequestException('学生不能预约危险等级为 Toxic/Explosive 的试剂');
      }
      await this.reagents.adjustFrozenStock(reagent.id, quantity);
    } else {
      await this.consumables.adjustFrozenStock(itemId, quantity);
    }

    const reservation = await this.repo.save(
      this.repo.create({
        itemId,
        itemType,
        userId: user.id,
        quantity,
        experimentDate,
        purpose: String(payload.purpose ?? ''),
        status: ReservationStatus.Pending,
      }),
    );

    await this.audit.record(user, 'CREATE_RESERVATION', 'reservation', {
      id: reservation.id,
      itemId,
      itemType,
      quantity,
      experimentDate,
    });

    return reservation;
  }

  async fulfill(id: string, fulfillQuantity: number, user: AuthUser) {
    const reservation = await this.findOne(id);
    if (reservation.status !== ReservationStatus.Pending) {
      throw new BadRequestException('只有待确认状态的预约才能领用');
    }

    const qty = fulfillQuantity ?? Number(reservation.quantity) - Number(reservation.fulfilledQuantity);
    const remaining = Number(reservation.quantity) - Number(reservation.fulfilledQuantity);
    if (qty <= 0 || qty > remaining) {
      throw new BadRequestException(`领用数量无效，剩余可领数量: ${remaining}`);
    }

    if (reservation.itemType === ItemType.Reagent) {
      await this.reagents.adjustStock(reservation.itemId, -qty, user, 'FULFILL_RESERVATION_REAGENT');
      await this.reagents.adjustFrozenStock(reservation.itemId, -qty);
    } else {
      await this.consumables.adjustStock(reservation.itemId, -qty, user, 'FULFILL_RESERVATION_CONSUMABLE');
      await this.consumables.adjustFrozenStock(reservation.itemId, -qty);
    }

    reservation.fulfilledQuantity = Number(reservation.fulfilledQuantity) + qty;

    if (Number(reservation.fulfilledQuantity) >= Number(reservation.quantity)) {
      reservation.status = ReservationStatus.Fulfilled;
      reservation.fulfilledAt = new Date();
    }

    const saved = await this.repo.save(reservation);

    await this.audit.record(user, 'FULFILL_RESERVATION', 'reservation', {
      id: saved.id,
      fulfillQuantity: qty,
      fulfilledQuantity: saved.fulfilledQuantity,
      totalQuantity: saved.quantity,
      status: saved.status,
    });

    return saved;
  }

  async cancel(id: string, user: AuthUser) {
    const reservation = await this.findOne(id);
    if (reservation.status !== ReservationStatus.Pending) {
      throw new BadRequestException('只有待确认状态的预约才能取消');
    }

    const unfulfilled = Number(reservation.quantity) - Number(reservation.fulfilledQuantity);

    if (unfulfilled > 0) {
      if (reservation.itemType === ItemType.Reagent) {
        await this.reagents.adjustFrozenStock(reservation.itemId, -unfulfilled);
      } else {
        await this.consumables.adjustFrozenStock(reservation.itemId, -unfulfilled);
      }
    }

    reservation.status = ReservationStatus.Cancelled;
    reservation.cancelledAt = new Date();
    const saved = await this.repo.save(reservation);

    await this.audit.record(user, 'CANCEL_RESERVATION', 'reservation', {
      id: saved.id,
      releasedFrozen: unfulfilled,
    });

    return saved;
  }

  async expireOverdue() {
    const now = new Date();
    const overdue = await this.repo.find({
      where: {
        status: ReservationStatus.Pending,
        experimentDate: LessThanOrEqual(now),
      },
    });

    const results: Reservation[] = [];
    for (const reservation of overdue) {
      const unfulfilled = Number(reservation.quantity) - Number(reservation.fulfilledQuantity);

      if (reservation.fulfilledQuantity > 0) {
        if (unfulfilled > 0) {
          if (reservation.itemType === ItemType.Reagent) {
            await this.reagents.adjustFrozenStock(reservation.itemId, -unfulfilled);
          } else {
            await this.consumables.adjustFrozenStock(reservation.itemId, -unfulfilled);
          }
        }
        reservation.status = ReservationStatus.Fulfilled;
        reservation.fulfilledAt = now;
      } else {
        if (reservation.itemType === ItemType.Reagent) {
          await this.reagents.adjustFrozenStock(reservation.itemId, -Number(reservation.quantity));
        } else {
          await this.consumables.adjustFrozenStock(reservation.itemId, -Number(reservation.quantity));
        }
        reservation.status = ReservationStatus.Expired;
        reservation.expiredAt = now;
      }

      results.push(await this.repo.save(reservation));
    }

    return results;
  }
}
