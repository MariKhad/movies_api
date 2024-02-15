import { Injectable } from '@nestjs/common';
import { MovieService } from './movie/movie.service';

@Injectable()
export class AppService {
  constructor(private movieService: MovieService) {
    this.movieService.cash();
  }
  getHello(): string {
    return 'This is a Movies Application';
  }
}
