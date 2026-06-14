import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('科研试剂与耗材库存管理 API')
  .setDescription('采购、入库、领用、盘点、危险化学品审批和库存预警接口')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
