import {
  Controller,
  Get,
  Req,
  Param,
  Delete,
  NotAcceptableException,
  Query,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

type Filter = {
  start: string | undefined;
  end: string | undefined;
};

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Show all reports' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get()
  async findAll(@Req() req: Request, @Query() filter: Filter) {
    return this.reportsService.findAll(filter.start, filter.end);
  }

  @ApiOperation({ summary: 'Show total amount of reports' })
  @Get('count')
  async countAll() {
    return {
      collection: 'reports',
      count: await this.reportsService.countAll(),
    };
  }

  @ApiOperation({ summary: 'Show report by id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @ApiOperation({ summary: "Delete report, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
