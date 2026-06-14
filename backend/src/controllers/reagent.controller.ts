import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReagentService } from '../services/reagent.service';
import { AuthenticatedRequest } from '../types/interfaces';
import { ok } from '../utils/response';

@ApiTags('reagents')
@ApiBearerAuth()
@Controller('reagents')
export class ReagentController {
  constructor(private readonly service: ReagentService) {}

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
    return ok(await this.service.create(body, req.user), '试剂已创建');
  }
}
