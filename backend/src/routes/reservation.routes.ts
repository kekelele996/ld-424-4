import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { Reservation } from '../models/reservation.entity';
import { ReservationController } from '../controllers/reservation.controller';
import { AuditService } from '../services/audit.service';
import { AlertService } from '../services/alert.service';
import { ConsumableService } from '../services/consumable.service';
import { ReagentService } from '../services/reagent.service';
import { ReservationService } from '../services/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Reagent, Consumable, AuditLog])],
  controllers: [ReservationController],
  providers: [ReservationService, ReagentService, ConsumableService, AuditService, AlertService],
})
export class ReservationRoutesModule {}
