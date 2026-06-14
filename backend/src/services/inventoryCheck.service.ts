import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryCheck } from '../models/inventoryCheck.entity';
import { InventoryCheckItem } from '../models/inventoryCheckItem.entity';
import { InventoryCheckStatus } from '../types/enums';
import { AuthUser } from '../types/interfaces';
import { AuditService } from './audit.service';

@Injectable()
export class InventoryCheckService {
  constructor(
    @InjectRepository(InventoryCheck) private readonly repo: Repository<InventoryCheck>,
    @InjectRepository(InventoryCheckItem) private readonly itemRepo: Repository<InventoryCheckItem>,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.repo.find({ relations: ['items'], order: { checkDate: 'DESC' } });
  }

  async create(payload: Partial<InventoryCheck> & { items?: Partial<InventoryCheckItem>[] }, user: AuthUser) {
    const check = await this.repo.save(this.repo.create({ ...payload, checkerId: payload.checkerId ?? user.id }));
    const items = await this.itemRepo.save((payload.items ?? []).map((item) => this.itemRepo.create({ ...item, inventoryCheck: check })));
    const hasDiscrepancy = items.some((item) => Number(item.difference) !== 0);
    check.items = items;
    check.status = hasDiscrepancy ? InventoryCheckStatus.Discrepancy : payload.status ?? InventoryCheckStatus.Completed;
    const saved = await this.repo.save(check);
    await this.audit.record(user, 'CREATE_INVENTORY_CHECK', 'inventoryCheck', { id: saved.id, status: saved.status });
    return saved;
  }
}
