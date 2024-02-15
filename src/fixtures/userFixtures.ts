import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ROLES } from '../../const';

export const wrongUserId = '6529579e4e5b';

export const getRandomUser = (): CreateUserDto => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    roles: [ROLES.USER],
    password: faker.internet.password(),
  };
};

export const getRandomUserNoName = (): UpdateUserDto => {
  return {
    email: faker.internet.email(),
    roles: [ROLES.USER],
    password: faker.internet.password(),
  };
};

export const getRandomUserNoEmail = (): UpdateUserDto => {
  return {
    username: faker.person.fullName(),
    roles: [ROLES.USER],
    password: faker.internet.password(),
  };
};

export const getRandomUserNoRoles = (): UpdateUserDto => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const getRandomUserNoPassword = (): UpdateUserDto => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    roles: ['user'],
  };
};
