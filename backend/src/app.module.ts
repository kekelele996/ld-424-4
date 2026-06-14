import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConsumableRoutesModule } from './routes/consumable.routes';
import { InventoryCheckRoutesModule } from './routes/inventoryCheck.routes';
import { ReagentRoutesModule } from './routes/reagent.routes';
import { StockInRoutesModule } from './routes/stockIn.routes';
import { UsageRoutesModule } from './routes/usage.routes';
import { AuditLogMiddleware } from './middlewares/auditLog.middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RateLimitMiddleware } from './middlewares/rateLimit.middleware';
import { RbacMiddleware } from './middlewares/rbac.middleware';
import { RequestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { ValidationMiddleware } from './middlewares/validation.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../.env', '.env'] }),
    TypeOrmModule.forRoot(databaseConfig()),
    ReagentRoutesModule,
    ConsumableRoutesModule,
    StockInRoutesModule,
    UsageRoutesModule,
    InventoryCheckRoutesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware, AuthMiddleware, RateLimitMiddleware, ValidationMiddleware, RbacMiddleware, AuditLogMiddleware).forRoutes('*');
  }
}
