import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DirectorDocument = HydratedDocument<Director>;

@Schema()
export class Director {
  @ApiProperty({
    description: "Director's full name",
    example: 'Steven Spielberg',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: "Director's birth date",
    example: '1946-12-18',
    required: true,
  })
  @Prop()
  birthday: Date;
}
export const DirectorSchema = SchemaFactory.createForClass(Director);
