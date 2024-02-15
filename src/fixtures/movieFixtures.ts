import { faker } from '@faker-js/faker';
import { CreateMovieDto } from '../movie/dto/create-movie.dto';
import { UpdateMovieDto } from '../movie/dto/update-movie.dto';

export const wrongMovieId = '6529579e4e5b';

export const getRandomMovie = (): CreateMovieDto => {
  return {
    name: faker.music.songName(),
    year: faker.number.int({ min: 1930, max: 2023 }),
    duration: faker.number.int({ min: 45, max: 150 }),
  };
};

export const getRandomMovieNoName = (): UpdateMovieDto => {
  return {
    year: faker.number.int({ min: 1930, max: 2023 }),
    duration: faker.number.int({ min: 45, max: 150 }),
  };
};
