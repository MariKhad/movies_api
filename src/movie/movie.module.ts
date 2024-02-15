import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Genre, GenreSchema } from '../schemas/genre.schema';
import { Director, DirectorSchema } from 'src/schemas/director.schema';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PlaylistService } from 'src/playlist/playlist.service';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { IsCreatorGuard } from 'src/auth/guards/creator.guard';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Director.name, schema: DirectorSchema },
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    AuthService,
    JwtService,
    ConfigService,
    UserService,
    PlaylistService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class MovieModule {}
