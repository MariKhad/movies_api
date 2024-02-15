import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DB_CONNECTION_URL } from '../../config';
import { Genre, GenreSchema } from '../schemas/genre.schema';
import { Director, DirectorSchema } from '../schemas/director.schema';
import { User, UserSchema } from '../schemas/user.schema';

describe('MovieController', () => {
  let controller: MovieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([
          { name: Movie.name, schema: MovieSchema },
          { name: Genre.name, schema: GenreSchema },
          { name: Director.name, schema: DirectorSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      controllers: [MovieController],
      providers: [
        MovieService,
        AuthService,
        JwtService,
        ConfigService,
        UserService,
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
