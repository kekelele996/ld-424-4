import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumable } from '../models/consumable.entity';
import { AuthUser } from '../types/interfaces';
import { AuditService } from './audit.service';
import { AlertService } from './alert.service';

@Injectable()
export class ConsumableService {
  constructor(
    @InjectRepository(Consumable) private readonly repo: Repository<Consumable>,
    private readonly audit: AuditService,
    private readonly alerts: AlertService,
  ) {}

  list() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async create(payload: Partial<Consumable>, user: AuthUser) {
    const consumable = await this.repo.save(this.repo.create(payload));
    await this.audit.record(user, 'CREATE_CONSUMABLE', 'consumable', { id: consumable.id });
    await this.alerts.cacheLowStockAlert(consumable, 'consumable');
    return consumable;
  }

  async findOne(id: string) {
    const consumable = await this.repo.findOneBy({ id });
    if (!consumable) throw new NotFoundException('耗材不存在');
    return consumable;
  }

  async adjustStock(id: string, delta: number, user: AuthUser, action = 'ADJUST_CONSUMABLE_STOCK') {
    const consumable = await this.findOne(id);
    consumable.currentStock = Number(consumable.currentStock) + delta;
    const saved = await this.repo.save(consumable);
    await this.audit.record(user, action, 'consumable', { id, delta, currentStock: saved.currentStock });
    await this.alerts.cacheLowStockAlert(saved, 'consumable');
    return saved;
  }

  async adjustFrozenStock(id: string, delta: number) {
    const consumable = await this.findOne(id);
    consumable.frozenStock = Number(consumable.frozenStock) + delta;
    if (consumable.frozenStock < 0) consumable.frozenStock = 0;
    return this.repo.save(consumable);
  }
}
