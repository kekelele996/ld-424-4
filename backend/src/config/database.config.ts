import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Consumable } from '../models/consumable.entity';
import { InventoryCheck } from '../models/inventoryCheck.entity';
import { InventoryCheckItem } from '../models/inventoryCheckItem.entity';
import { Reagent } from '../models/reagent.entity';
import { StockInRecord } from '../models/stockInRecord.entity';
import { UsageRecord } from '../models/usageRecord.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'reagent_user',
  password: process.env.DB_PASSWORD ?? 'reagent_password',
  database: process.env.DB_NAME ?? 'reagent_stock',
  entities: [Reagent, Consumable, StockInRecord, UsageRecord, InventoryCheck, InventoryCheckItem, AuditLog],
  synchronize: true,
});
