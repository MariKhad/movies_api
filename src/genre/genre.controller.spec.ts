import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from '../schemas/genre.schema';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '../schemas/user.schema';
import { DB_CONNECTION_URL } from '../../config';

describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([
          { name: Genre.name, schema: GenreSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      controllers: [GenreController],
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        UserService,
        GenreService,
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
