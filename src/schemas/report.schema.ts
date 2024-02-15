import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @ApiProperty({
    description: 'Total amount of movies on a specific date',
    required: true,
  })
  @Prop({ required: true })
  movies: number;

  @ApiProperty({
    description: 'Total amount of directors on a specific date',
    example: 'example@email.com',
    required: true,
  })
  @Prop({ required: true })
  directors: number;

  @ApiProperty({
    description: 'Total amount of genres on a specific date',
    example: 'example@email.com',
    required: true,
  })
  @Prop({ required: true })
  genres: number;

  @ApiProperty({
    description: 'Total amount of playlists on a specific date',
    required: true,
  })
  @Prop({ required: true })
  playlists: number;

  @ApiProperty({
    description: 'Total amount of users on a specific date',
    required: true,
  })
  @Prop({ required: true })
  users: number;

  @ApiProperty({
    description: 'Date of report',
    required: true,
  })
  @Prop({ required: true })
  date: number; // date will be in timestamp format
}
export const ReportSchema = SchemaFactory.createForClass(Report);
