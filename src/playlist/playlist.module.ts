import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from '../schemas/playlist.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { MovieService } from 'src/movie/movie.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { DirectorService } from 'src/director/director.service';
import { GenreService } from 'src/genre/genre.service';
import { Director, DirectorSchema } from 'src/schemas/director.schema';
import { Genre, GenreSchema } from 'src/schemas/genre.schema';
import { Movie, MovieSchema } from 'src/schemas/movie.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
      { name: Director.name, schema: DirectorSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [PlaylistController],
  providers: [
    PlaylistService,
    AuthService,
    JwtService,
    ConfigService,
    UserService,
    MovieService,
    DirectorService,
    GenreService,
  ],
})
export class PlaylistModule {}
