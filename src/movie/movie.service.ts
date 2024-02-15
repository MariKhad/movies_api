import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import NodeCache = require('node-cache');
const movieCache = new NodeCache({ stdTTL: 10000 });

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return new this.movieModel(createMovieDto).save();
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieModel.find();
  }

  async findAllJustNames(): Promise<Movie[]> {
    return await this.movieModel.find({}, { _id: 0, name: 1 });
  }

  async countAll(): Promise<number> {
    return await this.movieModel.find().countDocuments();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new Error(`Movie with ${id} not found`);
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new Error(`Movie with ${id} not found`);
    }
    movie?.set(updateMovieDto);
    return movie?.save();
  }

  async remove(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndDelete(id);
    if (!movie) {
      throw new Error(`Movie with ${id} not found`);
    }
    return movie;
  }

  async cash(): Promise<void> {
    const movies = await this.findAll();
    const publicMovies = await this.findAllJustNames();
    movieCache.mset([
      { key: 'movies', val: movies },
      { key: 'public', val: publicMovies },
    ]);
    console.log('Information was set to cash');
  }

  async getFromCash(hasRights: boolean): Promise<Movie[] | undefined> {
    if (hasRights) {
      if (movieCache.has('movies')) {
        console.log('Information was get from cash');
        return movieCache.get('movies');
      } else {
        return await this.findAll();
      }
    } else {
      if (movieCache.has('public')) {
        console.log('Information was get from cash');
        return movieCache.get('public');
      } else {
        return await this.findAllJustNames();
      }
    }
  }
}
