import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StockInService } from '../services/stockIn.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('stock-ins')
@ApiBearerAuth()
@Controller('stock-ins')
export class StockInController {
  constructor(private readonly service: StockInService) {}

  @Get()
  async list() {
    return ok(await this.service.list());
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.create(body, req.user), '入库记录已创建');
  }
}
