import { Test, TestingModule } from '@nestjs/testing';
import { DirectorController } from './director.controller';
import { DirectorService } from './director.service';
import { Director, DirectorSchema } from '../schemas/director.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { DB_CONNECTION_URL } from '../../config';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '../schemas/user.schema';

describe('DirectorController', () => {
  let controller: DirectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([
          { name: Director.name, schema: DirectorSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      controllers: [DirectorController],
      providers: [
        DirectorService,
        AuthService,
        JwtService,
        ConfigService,
        UserService,
      ],
    }).compile();

    controller = module.get<DirectorController>(DirectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
