import { Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Director, DirectorDocument } from '../schemas/director.schema';
import { Model } from 'mongoose';

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(Director.name)
    private directorModel: Model<DirectorDocument>,
  ) {}

  async create(createDirectorDto: CreateDirectorDto): Promise<Director> {
    return new this.directorModel(createDirectorDto).save();
  }

  async findAll(): Promise<Director[]> {
    return await this.directorModel.find({}, { _id: 0, __v: 0 });
  }

  async countAll(): Promise<number> {
    return await this.directorModel.find().countDocuments();
  }

  async findOne(id: string): Promise<Director> {
    const director = await this.directorModel.findById(id);
    if (!director) {
      throw new Error(`Director with ${id} not found`);
    }
    return director;
  }

  async update(
    id: string,
    updateDirectorDto: UpdateDirectorDto,
  ): Promise<Director> {
    const director = await this.directorModel.findById(id);
    if (!director) {
      throw new Error(`Movie with ${id} not found`);
    }
    director?.set(updateDirectorDto);
    return director?.save();
  }

  async remove(id: string): Promise<Director> {
    const director = await this.directorModel.findByIdAndDelete(id);
    if (!director) {
      throw new Error(`Director with ${id} not found`);
    }
    return director;
  }
}
