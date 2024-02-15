import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Movie, MovieDocument, MovieSchema } from '../schemas/movie.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  getRandomMovie,
  getRandomMovieNoName,
  wrongMovieId,
} from '../fixtures/movieFixtures';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MovieService', () => {
  let service: MovieService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-db'),
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
      ],
      providers: [MovieService],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/GET /movies/:id, able to get movie by Id', async () => {
    const createMovieDto = getRandomMovie();
    const createdMovie = (await service.create(
      createMovieDto,
    )) as MovieDocument;
    const id = createdMovie._id.toString();
    const movie = await service.findOne(id);
    expect(movie.name).toEqual(createdMovie.name);
    expect(movie.year).toEqual(createdMovie.year);
    expect(movie.duration).toEqual(createdMovie.duration);

    await service.remove(id);
  });

  it('/GET /movies/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongMovieId;
    await expect(service.findOne(id)).rejects.toThrow();
  });

  it('/POST /movies, able to create movie', async () => {
    const createMovieDto = getRandomMovie();
    const createdMovie = (await service.create(
      createMovieDto,
    )) as MovieDocument;
    const id = createdMovie._id.toString();
    expect(createMovieDto.name).toEqual(createdMovie.name);
    expect(createMovieDto.year).toEqual(createdMovie.year);
    expect(createMovieDto.duration).toEqual(createdMovie.duration);

    await service.remove(id);
  });

  it('/POST /movies, able to throw error, while creating movie without name', async () => {
    const movie = getRandomMovieNoName() as CreateMovieDto;
    await expect(service.create(movie)).rejects.toThrow();
  });

  it('/PUT /movies/:id, able to update movie by Id', async () => {
    const createMovieDto = getRandomMovie();
    const createdMovie = (await service.create(
      createMovieDto,
    )) as MovieDocument;
    const id = createdMovie._id.toString();
    const updateMovieDto = getRandomMovieNoName();
    const updatedMovie = await service.update(id, updateMovieDto);
    expect(updateMovieDto.year).toEqual(updatedMovie.year);
    expect(updateMovieDto.duration).toEqual(updatedMovie.duration);

    await service.remove(id);
  });

  it('/PUT /movies/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongMovieId;
    const updateMovieDto = getRandomMovieNoName();
    await expect(service.update(id, updateMovieDto)).rejects.toThrow();
  });

  it('/DELETE /movies/:id, able to delete movie by Id', async () => {
    const createMovieDto = getRandomMovie();
    const createdMovie = (await service.create(
      createMovieDto,
    )) as MovieDocument;
    const id = createdMovie._id.toString();
    const deletedMovie = await service.remove(id);
    expect(deletedMovie.name).toEqual(createdMovie.name);
  });

  it('/DELETE /movies/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongMovieId;
    await expect(service.remove(id)).rejects.toThrow();
  });

  /* afterAll(async () => {
    const movieModel = module.get('MovieModel');
    await movieModel.deleteMany({});
  }); */
});
