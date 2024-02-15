import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from '../schemas/playlist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    createPlaylistDto.movies = Array.from(new Set(createPlaylistDto.movies));
    return new this.playlistModel(createPlaylistDto).save();
  }

  async findAll(): Promise<Playlist[]> {
    return await this.playlistModel.find();
  }

  async findAllPublic(): Promise<Playlist[]> {
    return await this.playlistModel.find(
      { isPublic: true },
      { isPublic: 0, user: 0, __v: 0 },
    );
  }

  async findTop50(): Promise<Playlist[]> {
    return await this.playlistModel
      .find({}, { isPublic: 0, user: 0, __v: 0, movies: 0, _id: 0 })
      .sort({ copyCount: -1 })
      .limit(3);
  }

  async countAll(): Promise<number> {
    return await this.playlistModel.find().countDocuments();
  }

  async findUserPlaylists(id: string): Promise<string> {
    return (
      await this.playlistModel.find({ user: id }).distinct('_id')
    ).toString();
  }

  async findOne(id: string): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      throw new Error(`Playlist with ${id} not found`);
    }
    return playlist;
  }

  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      throw new Error(`Playlist with ${id} not found`);
    }
    updatePlaylistDto.movies = Array.from(new Set(updatePlaylistDto.movies));
    playlist?.set(updatePlaylistDto);
    return playlist?.save();
  }

  async remove(id: string) {
    const playlist = await this.playlistModel.findByIdAndDelete(id);
    if (!playlist) {
      throw new Error(`Playlist with ${id} not found`);
    }
    return playlist;
  }

  async addMovie(playlistId: string, movieId: string) {
    return await this.playlistModel.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: { movies: movieId },
      },
      { new: true },
    );
  }

  async removeMovie(playlistId: string, movieId: string) {
    return await this.playlistModel.findByIdAndUpdate(
      playlistId,
      {
        $pull: { movies: movieId },
      },
      { new: true },
    );
  }

  async removeMovieFromPlaylists(
    movieId: string,
    session: mongoose.mongo.ClientSession,
  ) {
    return await this.playlistModel.updateMany(
      { movies: movieId },
      {
        $pull: { movies: movieId },
      },
      { session, new: true },
    );
  }

  async incrementCopyCount(id: string, increment: number) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      throw new Error(`Playlist with ${id} not found`);
    }
    playlist.copyCount = playlist.copyCount + increment;
    return playlist.save();
  }
}
