import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DB_CONNECTION_URL } from '../../config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { MovieService } from '../movie/movie.service';
import { Director, DirectorSchema } from '../schemas/director.schema';
import { DirectorService } from '../director/director.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Movie.name, schema: MovieSchema },
          { name: Director.name, schema: DirectorSchema },
        ]),
        JwtModule,
        PassportModule,
      ],
      providers: [
        AuthService,
        JwtService,
        JwtStrategy,
        UserService,
        ConfigService,
        MovieService,
        DirectorService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
