import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConsumableService } from '../services/consumable.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('consumables')
@ApiBearerAuth()
@Controller('consumables')
export class ConsumableController {
  constructor(private readonly service: ConsumableService) {}

  @Get()
  async list() {
    return ok(await this.service.list());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ok(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.create(body, req.user), '耗材已创建');
  }
}
