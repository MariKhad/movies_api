import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from '../schemas/playlist.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Director, DirectorSchema } from '../schemas/director.schema';
import { Genre, GenreSchema } from '../schemas/genre.schema';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { PlaylistService } from '../playlist/playlist.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { DirectorService } from '../director/director.service';
import { MovieService } from '../movie/movie.service';
import { GenreService } from '../genre/genre.service';
import { Report, ReportSchema } from '../schemas/report.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Report.name, schema: ReportSchema },
      { name: User.name, schema: UserSchema },
      { name: Director.name, schema: DirectorSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    PlaylistService,
    AuthService,
    JwtService,
    ConfigService,
    UserService,
    MovieService,
    DirectorService,
    GenreService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ReportsModule {}
