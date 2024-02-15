import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type GenreDocument = HydratedDocument<Genre>;

@Schema()
export class Genre {
  @ApiProperty({
    description: 'Genre name, should be unique',
    example: 'Comedy',
    required: true,
  })
  @Prop({ required: true, unique: true })
  name: string;
}
export const GenreSchema = SchemaFactory.createForClass(Genre);
