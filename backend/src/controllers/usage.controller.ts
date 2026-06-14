import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsageService } from '../services/usage.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('usage-records')
@ApiBearerAuth()
@Controller('usage-records')
export class UsageController {
  constructor(private readonly service: UsageService) {}

  @Get()
  async list() {
    return ok(await this.service.list());
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.create(body, req.user), '领用记录已创建');
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.approve(id, req.user), '领用已审批');
  }
}
