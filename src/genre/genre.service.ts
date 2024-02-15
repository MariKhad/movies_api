import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from '../schemas/genre.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name)
    private genreModel: Model<GenreDocument>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return new this.genreModel(createGenreDto).save();
  }

  async findAll(): Promise<Genre[]> {
    return await this.genreModel.find();
  }

  async countAll(): Promise<number> {
    return await this.genreModel.find().countDocuments();
  }

  async findOne(id: string): Promise<Genre> {
    const genre = await this.genreModel.findById(id);
    if (!genre) {
      throw new Error(`Genre with ${id} not found`);
    }
    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.genreModel.findById(id);
    if (!genre) {
      throw new Error(`Genre with ${id} not found`);
    }
    genre?.set(updateGenreDto);
    return genre?.save();
  }

  async remove(id: string): Promise<Genre> {
    const genre = await this.genreModel.findByIdAndDelete(id);
    if (!genre) {
      throw new Error(`Genre with ${id} not found`);
    }
    return genre;
  }
}
