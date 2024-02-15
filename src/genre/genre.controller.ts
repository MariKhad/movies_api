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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Show total amount of genres' })
  @Public()
  @Get('count')
  async countAll() {
    return {
      collection: 'genres',
      count: await this.genreService.countAll(),
    };
  }

  @ApiOperation({ summary: 'Create a new genre' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createGenreDto: CreateGenreDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.genreService.create(createGenreDto);
  }

  @ApiOperation({ summary: 'Show all genres' })
  @Public()
  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @ApiOperation({ summary: "Show one genre by it's id" })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @ApiOperation({ summary: "Update genre, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.genreService.update(id, updateGenreDto);
  }

  @ApiOperation({ summary: "Delete genre, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    return this.genreService.remove(id);
  }
}
