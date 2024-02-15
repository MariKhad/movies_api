import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreDocument, GenreSchema } from '../schemas/genre.schema';
import {
  getGenreNoName,
  getRandomGenre,
  wrongGenreId,
} from '../fixtures/genreFixtures';
import { CreateGenreDto } from './dto/create-genre.dto';

describe('GenreService', () => {
  let service: GenreService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-db'),
        MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
      ],
      providers: [GenreService],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/GET /genres/:id, able to get genre by Id', async () => {
    const createGenreDto = getRandomGenre();
    const createdGenre = (await service.create(
      createGenreDto,
    )) as GenreDocument;
    const id = createdGenre._id.toString();
    const genre = await service.findOne(id);
    expect(genre.name).toEqual(createdGenre.name);

    await service.remove(id);
  });

  it('/GET /genres/:id, able to throw error on wrong genre Id', async () => {
    const id = wrongGenreId;
    await expect(service.findOne(id)).rejects.toThrow();
  });

  it('/POST /genres, able to create genre', async () => {
    const createGenreDto = getRandomGenre();
    const createdGenre = (await service.create(
      createGenreDto,
    )) as GenreDocument;
    const id = createdGenre._id.toString();
    expect(createGenreDto.name).toEqual(createdGenre.name);

    await service.remove(id);
  });

  it('/POST /genres, able to throw error, while creating genre without name', async () => {
    const Genre = getGenreNoName() as CreateGenreDto;
    await expect(service.create(Genre)).rejects.toThrow();
  });

  it('/PUT /genres/:id, able to update genre by Id ', async () => {
    const createGenreDto = getRandomGenre();
    const createdGenre = (await service.create(
      createGenreDto,
    )) as GenreDocument;
    const id = createdGenre._id.toString();
    const updateGenreDto = getRandomGenre();
    const updatedGenre = await service.update(id, updateGenreDto);
    expect(updateGenreDto.name).toEqual(updatedGenre.name);

    await service.remove(id);
  });

  it('/PUT genres/:id, able to throw error on wrong genre Id', async () => {
    const id = wrongGenreId;
    const updateGenreDto = getGenreNoName();
    await expect(service.update(id, updateGenreDto)).rejects.toThrow();
  });

  it('/DELETE genres/:id, able to delete genre by Id', async () => {
    const createGenreDto = getRandomGenre();
    const createdGenre = (await service.create(
      createGenreDto,
    )) as GenreDocument;
    const id = createdGenre._id.toString();
    const deletedGenre = await service.remove(id);
    expect(deletedGenre.name).toEqual(createdGenre.name);
  });

  it('/DELETE genres/:id, able to throw error on wrong genre Id', async () => {
    const id = wrongGenreId;
    await expect(service.remove(id)).rejects.toThrow();
  });
});
