import { Request, Response } from 'express';
import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Res,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from '../decorators/public.decorator';
import { NotAcceptableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { PlaylistService } from '../playlist/playlist.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { UserDocument } from '../schemas/user.schema';
import { Permissions } from '../enums/permissions.enum';
import { FORMATS, Filter } from '../../const';
import * as csv from '@fast-csv/format';
import * as fs from 'fs';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(
    @InjectConnection() private connection: mongoose.Connection,
    private readonly movieService: MovieService,
    private authService: AuthService,
    private playlistService: PlaylistService,
  ) {}

  @ApiOperation({ summary: 'Show total amount of movies' })
  @Public()
  @Get('count')
  async countAll() {
    return {
      collection: 'movies',
      count: await this.movieService.countAll(),
    };
  }

  @ApiOperation({
    summary:
      'Show all movies, additional information varies depending on access',
  })
  @Public()
  @Get()
  async findAll(@Headers('Authorization') authorizationHeader: string) {
    const hasRights = await this.authService.isTokenValid(authorizationHeader);
    return this.movieService.getFromCash(hasRights);
  }

  @ApiOperation({
    summary: 'Get file with all movies exported',
  })
  @Public()
  @Get('export')
  //TODO 2 different routes
  async exportData(@Res() res: Response, @Query() filter: Filter) {
    const movies = await this.movieService.findAll();
    if (filter.format === FORMATS.CSV) {
      const fileName = 'movies.csv';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'text/csv');
      const csvStream = csv.format({ headers: true, delimiter: ';' });
      csvStream.pipe(res);
      movies.forEach((movie) => {
        const jsonString = JSON.stringify(movie);
        csvStream.write(JSON.parse(jsonString));
      });
      csvStream.end();
    }
    if (filter.format === FORMATS.JSON || filter.format === undefined) {
      const dataString = JSON.stringify(movies);
      const fileName = 'movies.json';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/json');
      res.send(dataString);
    }
  }

  @ApiOperation({ summary: 'Create a new movie' })
  @ApiBearerAuth()
  //@Roles(Role.Admin)
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto, @Req() req: Request) {
    const { user } = req;
    const hasPermission = this.authService.can(
      user as UserDocument,
      Permissions.MOVIES_CUD,
    );
    if (hasPermission) {
      const movie = await this.movieService.create(createMovieDto);
      await this.movieService.cash();
      return movie;
    } else {
      throw new NotAcceptableException();
    }
  }

  @ApiOperation({ summary: "Show one movie by it's id" })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @ApiOperation({ summary: "Update movie, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const movie = await this.movieService.update(id, updateMovieDto);
    await this.movieService.cash();
    return movie;
  }

  @ApiOperation({ summary: "Delete movie, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const movie = await this.movieService.remove(id);
      await this.playlistService.removeMovieFromPlaylists(id, session);
      await this.movieService.cash();
      await session.commitTransaction();
      return movie;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
