import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Genre } from './genre.schema';
import { Director } from './director.schema';
import { ApiProperty } from '@nestjs/swagger';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @ApiProperty({
    description: 'Movie name, may be repeated',
    example: 'Home Alone',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Year when movie was created',
    example: '2001',
  })
  @Prop()
  year: number;

  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: '121',
  })
  @Prop()
  duration: number;

  @ApiProperty({
    type: () => Genre,
    default: [],
    isArray: true,
    description: 'List of the movie genres',
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }] })
  genres: Genre[];

  @ApiProperty({
    type: () => Director,
    default: [],
    isArray: true,
    description: 'List of the movie directors',
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }] })
  directors: Director[];
}
export const MovieSchema = SchemaFactory.createForClass(Movie);
