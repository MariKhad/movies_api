import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../schemas/report.schema';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { PlaylistService } from '../playlist/playlist.service';
import { DirectorService } from '../director/director.service';
import { GenreService } from '../genre/genre.service';
import * as schedule from 'node-schedule';
import { isTimeValid } from '../helpers/help';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    private movieService: MovieService,
    private userService: UserService,
    private playlistService: PlaylistService,
    private directorService: DirectorService,
    private genreService: GenreService,
  ) {
    schedule.scheduleJob('*/2 * * * *', async () => {
      const report = await this.getReportDate();
      this.genereate(report);
    });
  }

  async getReportDate(): Promise<CreateReportDto> {
    const report = {
      movies: await this.movieService.countAll(),
      directors: await this.directorService.countAll(),
      genres: await this.genreService.countAll(),
      playlists: await this.playlistService.countAll(),
      users: await this.userService.countAll(),
      date: Date.now(),
    };
    return report;
  }

  async genereate(report: CreateReportDto): Promise<Report> {
    return await new this.reportModel(report).save();
  }

  async findAll(
    start: string | undefined,
    end: string | undefined,
  ): Promise<Report[] | null> {
    const startDate = !start ? 0 : +start;
    const endDate = !end ? Date.now() : +end;
    console.log(startDate);
    console.log(endDate);
    if (isTimeValid(startDate) && isTimeValid(endDate)) {
      return await this.reportModel.find({
        date: { $gte: startDate, $lte: endDate },
      });
    } else {
      throw new Error('Range info is not valid');
    }
  }
  async findOne(id: string) {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new Error(`User with ${id} not found`);
    }
    return report;
  }

  async countAll(): Promise<number> {
    return await this.reportModel.find().countDocuments();
  }

  async remove(id: string) {
    const report = await this.reportModel.findByIdAndDelete(id);
    if (!report) {
      throw new Error(`Playlist with ${id} not found`);
    }
    return report;
  }
}
