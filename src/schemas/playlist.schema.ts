import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Movie } from '../schemas/movie.schema';
import { User } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema()
export class Playlist {
  @ApiProperty({
    description: 'Title of playlist, may be repeated',
    example: 'New Year Comedies',
    required: true,
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    type: () => Movie,
    description: "Array of movie Ids, can't be repeated",
    required: true,
    default: [],
    isArray: true,
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    default: [],
  })
  movies: Array<Movie>;

  @ApiProperty({
    type: () => User,
    description: 'Id of creater of the playlist',
    required: true,
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  createdBy: User;

  @ApiProperty({
    description: 'Public/private flag, playlist is private by default',
    required: true,
    default: false,
  })
  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: 0 })
  copyCount: number;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
