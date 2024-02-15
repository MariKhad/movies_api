import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { IsCreatorGuard } from 'src/auth/guards/creator.guard';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';
import { Movie, MovieSchema } from 'src/schemas/movie.schema';
import { MovieService } from 'src/movie/movie.service';
import { PlaylistService } from 'src/playlist/playlist.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ConfigService,
    MovieService,
    PlaylistService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IsCreatorGuard,
    },
  ],
})
export class UserModule {}
