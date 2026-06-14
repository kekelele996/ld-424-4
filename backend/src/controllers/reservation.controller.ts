import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationService } from '../services/reservation.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

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
    return ok(await this.service.create(body, req.user), '预约已创建，库存已冻结');
  }

  @Patch(':id/fulfill')
  async fulfill(@Param('id') id: string, @Body() body: { quantity?: number }, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.fulfill(id, body.quantity, req.user), '已从预约中领用');
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return ok(await this.service.cancel(id, req.user), '预约已取消，冻结库存已释放');
  }

  @Post('expire-overdue')
  async expireOverdue() {
    return ok(await this.service.expireOverdue(), '超时预约已处理');
  }
}
