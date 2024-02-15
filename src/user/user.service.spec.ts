import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import {
  getRandomUser,
  getRandomUserNoEmail,
  getRandomUserNoName,
  wrongUserId,
} from '../fixtures/userFixtures';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_CONNECTION_URL } from '../../config';

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(DB_CONNECTION_URL),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService, AuthService, JwtService, ConfigService],
    }).compile();

    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/GET /users/:id, able to get user by Id', async () => {
    const createUserDto = getRandomUser();
    const createdUser = (await service.create(createUserDto)) as UserDocument;
    const id = createdUser._id.toString();
    const user = await service.findOne(id);
    expect(user.username).toEqual(createdUser.username);
    expect(user.email).toEqual(createdUser.email);

    await service.remove(id);
  });

  it('/GET /users/:id, able to throw error on wrong user id', async () => {
    const id = wrongUserId;
    await expect(service.findOne(id)).rejects.toThrow();
  });

  it('/POST /users, able to create user', async () => {
    const createUserDto = getRandomUser();
    const createdUser = (await service.create(createUserDto)) as UserDocument;
    expect(createUserDto.username).toEqual(createdUser.username);
    expect(createUserDto.email).toEqual(createdUser.email);
    const id = createdUser._id.toString();
    await service.remove(id);
  });

  it('/POST users, able to throw error, while creating user without name', async () => {
    const user = getRandomUserNoName() as CreateUserDto;
    await expect(service.create(user)).rejects.toThrow();
  });

  it('/POST users, able to throw error, while creating user without email', async () => {
    const user = getRandomUserNoEmail() as CreateUserDto;
    await expect(service.create(user)).rejects.toThrow();
  });

  it('/PUT /users/:id, able to update user by Id', async () => {
    const createUserDto = getRandomUser();
    const createdUser = (await service.create(createUserDto)) as UserDocument;
    const id = createdUser._id.toString();
    const updateUserDto = getRandomUserNoEmail();
    const updatedUser = await service.update(id, updateUserDto);
    expect(updateUserDto.username).toEqual(updatedUser.username);

    await service.remove(id);
  });

  it('/PUT /users/:id, able to throw error on wrong user Id', async () => {
    const id = wrongUserId;
    const updateUserDto = getRandomUserNoName();
    await expect(service.update(id, updateUserDto)).rejects.toThrow();
  });

  it('/DELETE users/:id, able to delete user by Id', async () => {
    const createUserDto = getRandomUser();
    const createdUser = (await service.create(createUserDto)) as UserDocument;
    const id = createdUser._id.toString();
    const deletedUser = await service.remove(id);
    expect(deletedUser.username).toEqual(createdUser.username);
  });

  it('/DELETE /users/:id, able to throw error on wrong user Id', async () => {
    const id = wrongUserId;
    await expect(service.remove(id)).rejects.toThrow();
  });

  /*   afterAll(async () => {
    const userModel = module.get('UserModel');
    await userModel.deleteMany({});
  }); */
});
