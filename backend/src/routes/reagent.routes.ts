import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Reagent } from '../models/reagent.entity';
import { ReagentController } from '../controllers/reagent.controller';
import { AuditService } from '../services/audit.service';
import { AlertService } from '../services/alert.service';
import { ReagentService } from '../services/reagent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reagent, AuditLog])],
  controllers: [ReagentController],
  providers: [ReagentService, AuditService, AlertService],
  exports: [ReagentService],
})
export class ReagentRoutesModule {}
