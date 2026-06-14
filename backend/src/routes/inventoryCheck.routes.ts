import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { InventoryCheck } from '../models/inventoryCheck.entity';
import { InventoryCheckItem } from '../models/inventoryCheckItem.entity';
import { InventoryCheckController } from '../controllers/inventoryCheck.controller';
import { AuditService } from '../services/audit.service';
import { InventoryCheckService } from '../services/inventoryCheck.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryCheck, InventoryCheckItem, AuditLog])],
  controllers: [InventoryCheckController],
  providers: [InventoryCheckService, AuditService],
})
export class InventoryCheckRoutesModule {}
