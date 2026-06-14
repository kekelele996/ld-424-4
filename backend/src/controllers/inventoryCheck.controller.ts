import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InventoryCheckService } from '../services/inventoryCheck.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('inventory-checks')
@ApiBearerAuth()
@Controller('inventory-checks')
export class InventoryCheckController {
  constructor(private readonly service: InventoryCheckService) {}

  @Get()
  async list() {
    return ok(await this.service.list());
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.create(body, req.user), '盘点记录已创建');
  }
}
