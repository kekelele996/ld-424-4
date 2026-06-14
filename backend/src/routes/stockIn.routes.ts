import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { StockInRecord } from '../models/stockInRecord.entity';
import { StockInController } from '../controllers/stockIn.controller';
import { AuditService } from '../services/audit.service';
import { AlertService } from '../services/alert.service';
import { ConsumableService } from '../services/consumable.service';
import { ReagentService } from '../services/reagent.service';
import { StockInService } from '../services/stockIn.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockInRecord, Reagent, Consumable, AuditLog])],
  controllers: [StockInController],
  providers: [StockInService, ReagentService, ConsumableService, AuditService, AlertService],
})
export class StockInRoutesModule {}
