import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MovieService } from '../movie/movie.service';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { Director, DirectorSchema } from '../schemas/director.schema';
import { DirectorService } from '../director/director.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Director.name, schema: DirectorSchema },
    ]),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    ConfigService,
    UserService,
    MovieService,
    DirectorService,
    MailService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
