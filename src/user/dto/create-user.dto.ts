import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "User's nichname for login",
    example: 'RobStark89',
  })
  username: string;

  @ApiProperty({
    description: "User's email, should be unique",
    example: 'example@email.com',
  })
  email: string;

  @ApiProperty({
    description: "A list of user's roles",
    default: ['user'],
    isArray: true,
  })
  roles: string[];

  @ApiProperty({ description: 'Just good dificult password' })
  password: string;

  @ApiPropertyOptional({
    description: 'A list of users playlists',
    isArray: true,
  })
  playlists?: string[];
}
