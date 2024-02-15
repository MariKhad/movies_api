import { Test, TestingModule } from '@nestjs/testing';
import { DirectorService } from './director.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Director,
  DirectorDocument,
  DirectorSchema,
} from '../schemas/director.schema';
import {
  getRandomDirector,
  getRandomDirectorNoBirthdate,
  getRandomDirectorNoName,
  wrongDirectorId,
} from '../fixtures/directorFixtures';
import { CreateDirectorDto } from './dto/create-director.dto';

describe('DirectorService', () => {
  let service: DirectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-db'),
        MongooseModule.forFeature([
          { name: Director.name, schema: DirectorSchema },
        ]),
      ],
      providers: [DirectorService],
    }).compile();

    service = module.get<DirectorService>(DirectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/GET /directors/:id, able to get director by Id', async () => {
    const createDirectorDto = getRandomDirector();
    const createdDirector = (await service.create(
      createDirectorDto,
    )) as DirectorDocument;
    const id = createdDirector._id.toString();
    const director = await service.findOne(id);
    expect(director.name).toEqual(createdDirector.name);
    expect(director.birthday).toEqual(createdDirector.birthday);

    await service.remove(id);
  });

  it('/GET /directors/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongDirectorId;
    await expect(service.findOne(id)).rejects.toThrow();
  });

  it('/POST /directors, able to create director', async () => {
    const createDirectorDto = getRandomDirector();
    const createdDirector = (await service.create(
      createDirectorDto,
    )) as DirectorDocument;
    const id = createdDirector._id.toString();
    expect(createDirectorDto.name).toEqual(createdDirector.name);
    expect(createDirectorDto.birthday).toEqual(createdDirector.birthday);

    await service.remove(id);
  });

  it('/POST /directors, able to throw error, while creating director without name', async () => {
    const Director = getRandomDirectorNoName() as CreateDirectorDto;
    await expect(service.create(Director)).rejects.toThrow();
  });

  it('/PUT /directors/:id, able to update director by Id', async () => {
    const createDirectorDto = getRandomDirector();
    const createdDirector = (await service.create(
      createDirectorDto,
    )) as DirectorDocument;
    const id = createdDirector._id.toString();
    const updateDirectorDto = getRandomDirectorNoBirthdate();
    const updatedDirector = await service.update(id, updateDirectorDto);
    expect(updateDirectorDto.name).toEqual(updatedDirector.name);

    await service.remove(id);
  });

  it('/PUT /directors/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongDirectorId;
    const updateDirectorDto = getRandomDirectorNoName();
    await expect(service.update(id, updateDirectorDto)).rejects.toThrow();
  });

  it('/DELETE /directors/:id, able to delete director by Id', async () => {
    const createDirectorDto = getRandomDirector();
    const createdDirector = (await service.create(
      createDirectorDto,
    )) as DirectorDocument;
    const id = createdDirector._id.toString();
    const deletedDirector = await service.remove(id);
    expect(deletedDirector.name).toEqual(createdDirector.name);
  });

  it('/DELETE /directors/:id, able to throw error on wrong movie Id', async () => {
    const id = wrongDirectorId;
    await expect(service.remove(id)).rejects.toThrow();
  });
});
