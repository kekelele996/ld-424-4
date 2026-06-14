import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockInRecord } from '../models/stockInRecord.entity';
import { ItemType } from '../types/enums';
import { AuthUser } from '../types/interfaces';
import { AuditService } from './audit.service';
import { ConsumableService } from './consumable.service';
import { ReagentService } from './reagent.service';

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockInRecord) private readonly repo: Repository<StockInRecord>,
    private readonly reagents: ReagentService,
    private readonly consumables: ConsumableService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.repo.find({ order: { stockInDate: 'DESC' } });
  }

  async create(payload: Partial<StockInRecord>, user: AuthUser) {
    const record = await this.repo.save(this.repo.create(payload));
    if (record.itemType === ItemType.Reagent) {
      await this.reagents.adjustStock(record.itemId, Number(record.quantity), user, 'STOCK_IN_REAGENT');
    } else {
      await this.consumables.adjustStock(record.itemId, Number(record.quantity), user, 'STOCK_IN_CONSUMABLE');
    }
    await this.audit.record(user, 'CREATE_STOCK_IN', 'stockInRecord', { id: record.id, itemType: record.itemType });
    return record;
  }
}
