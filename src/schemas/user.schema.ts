import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Playlist } from './playlist.schema';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';
//import { ROLES } from 'const';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    description: "User's nichname for login",
    example: 'RobStark89',
    required: true,
  })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: "User's email, should be unique",
    example: 'example@email.com',
    required: true,
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: `A list of user's roles`,
    default: ['user'],
    isArray: true,
  })
  @Prop({
    required: true,
    type: [{ type: String, enum: ['admin', 'user', 'moderator'] }],
    default: ['user'],
  })
  roles: Role[];

  @ApiProperty({ description: 'Just good dificult password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    type: () => Playlist,
    default: [],
    isArray: true,
    description: "A list of user's playlists",
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
    default: [],
    isArray: true,
  })
  playlists: Playlist[];
}
export const UserSchema = SchemaFactory.createForClass(User);
