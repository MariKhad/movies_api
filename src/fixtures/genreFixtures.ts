import { faker } from '@faker-js/faker';
import { CreateGenreDto } from '../genre/dto/create-genre.dto';
import { UpdateGenreDto } from '../genre/dto/update-genre.dto';

export const wrongGenreId = '6529579e4e5b';

export const getRandomGenre = (): CreateGenreDto => {
  return {
    name: faker.word.noun(5),
  };
};

export const getGenreNoName = (): UpdateGenreDto => {
  return {};
};
