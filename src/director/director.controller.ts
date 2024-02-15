import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@ApiTags('Directors')
@Controller('directors')
export class DirectorController {
  constructor(
    private readonly directorService: DirectorService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create a new director' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createDirectorDto: CreateDirectorDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.directorService.create(createDirectorDto);
  }

  @ApiOperation({ summary: 'Show all directors' })
  @Public()
  @Get()
  findAll() {
    return this.directorService.findAll();
  }

  @ApiOperation({ summary: 'Show total amount of directors' })
  @Public()
  @Get('count')
  async countAll() {
    return {
      collection: 'directors',
      count: await this.directorService.countAll(),
    };
  }

  @ApiOperation({ summary: "Show one director by it's id" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directorService.findOne(id);
  }

  @ApiOperation({ summary: "Update director, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDirectorDto: UpdateDirectorDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.directorService.update(id, updateDirectorDto);
  }

  @ApiOperation({ summary: "Delete director, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.directorService.remove(id);
  }
}
