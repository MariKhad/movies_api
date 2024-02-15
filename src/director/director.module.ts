import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Director, DirectorSchema } from 'src/schemas/director.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';
import { PlaylistService } from 'src/playlist/playlist.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Director.name, schema: DirectorSchema },
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [DirectorController],
  providers: [
    DirectorService,
    AuthService,
    JwtService,
    ConfigService,
    UserService,
    PlaylistService,
  ],
})
export class DirectorModule {}
