import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reagent } from '../models/reagent.entity';
import { AuthUser } from '../types/interfaces';
import { AuditService } from './audit.service';
import { AlertService } from './alert.service';

@Injectable()
export class ReagentService {
  constructor(
    @InjectRepository(Reagent) private readonly repo: Repository<Reagent>,
    private readonly audit: AuditService,
    private readonly alerts: AlertService,
  ) {}

  list() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async create(payload: Partial<Reagent> & Record<string, unknown>, user: AuthUser) {
    const normalized: Partial<Reagent> = {
      ...payload,
      casNumber: String(payload.casNumber ?? payload.cas ?? ''),
      molecularFormula: String(payload.molecularFormula ?? payload.formula ?? ''),
      molecularWeight: Number(payload.molecularWeight ?? 0),
      purityGrade: String(payload.purityGrade ?? payload.purity ?? ''),
      currentStock: Number(payload.currentStock ?? payload.stock ?? 0),
      minStockThreshold: Number(payload.minStockThreshold ?? payload.minThreshold ?? 0),
    };
    const reagent = await this.repo.save(this.repo.create(normalized));
    await this.audit.record(user, 'CREATE_REAGENT', 'reagent', { id: reagent.id, hazardLevel: reagent.hazardLevel });
    await this.alerts.cacheLowStockAlert(reagent, 'reagent');
    return reagent;
  }

  async findOne(id: string) {
    const reagent = await this.repo.findOneBy({ id });
    if (!reagent) throw new NotFoundException('试剂不存在');
    return reagent;
  }

  async adjustStock(id: string, delta: number, user: AuthUser, action = 'ADJUST_REAGENT_STOCK') {
    const reagent = await this.findOne(id);
    reagent.currentStock = Number(reagent.currentStock) + delta;
    const saved = await this.repo.save(reagent);
    await this.audit.record(user, action, 'reagent', { id, delta, currentStock: saved.currentStock });
    await this.alerts.cacheLowStockAlert(saved, 'reagent');
    return saved;
  }

  async adjustFrozenStock(id: string, delta: number) {
    const reagent = await this.findOne(id);
    reagent.frozenStock = Number(reagent.frozenStock) + delta;
    if (reagent.frozenStock < 0) reagent.frozenStock = 0;
    return this.repo.save(reagent);
  }
}
