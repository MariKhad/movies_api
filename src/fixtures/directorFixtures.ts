import { faker } from '@faker-js/faker';
import { CreateDirectorDto } from '../director/dto/create-director.dto';
import { UpdateDirectorDto } from '../director/dto/update-director.dto';

export const wrongDirectorId = '6529579e4e5b';

export const getRandomDirector = (): CreateDirectorDto => {
  return {
    name: faker.person.fullName(),
    birthday: faker.date.birthdate({ min: 1930, max: 2000, mode: 'year' }),
  };
};

export const getRandomDirectorNoName = (): UpdateDirectorDto => {
  return {
    birthday: faker.date.birthdate({ min: 1900, max: 2000, mode: 'year' }),
  };
};

export const getRandomDirectorNoBirthdate = (): UpdateDirectorDto => {
  return {
    name: faker.person.fullName(),
  };
};
