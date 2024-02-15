import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION_URL } from '../../config';
import { User, UserSchema } from '../schemas/user.schema';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MovieService } from '../movie/movie.service';
import { DirectorService } from '../director/director.service';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { Director, DirectorSchema } from '../schemas/director.schema';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Movie.name, schema: MovieSchema },
          { name: Director.name, schema: DirectorSchema },
        ]),
        PassportModule,
        JwtModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        JwtStrategy,
        ConfigService,
        UserService,
        MovieService,
        DirectorService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
