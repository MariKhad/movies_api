import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from 'src/schemas/genre.schema';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { IsCreatorGuard } from 'src/auth/guards/creator.guard';
import { PlaylistService } from 'src/playlist/playlist.service';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Genre.name, schema: GenreSchema },
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [GenreController],
  providers: [
    GenreService,
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
export class GenreModule {}
