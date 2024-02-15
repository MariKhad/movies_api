import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'Total amount of movies on a specific date',
    required: true,
  })
  movies: number;

  @ApiProperty({
    description: 'Total amount of directors on a specific date',
    example: 'example@email.com',
    required: true,
  })
  directors: number;

  @ApiProperty({
    description: 'Total amount of genres on a specific date',
    example: 'example@email.com',
    required: true,
  })
  genres: number;

  @ApiProperty({
    description: 'Total amount of playlists on a specific date',
    required: true,
  })
  playlists: number;

  @ApiProperty({
    description: 'Total amount of users on a specific date',
    required: true,
  })
  users: number;

  @ApiProperty({
    description: 'Date of report',
    required: true,
  })
  date: number; // date will be in timestamp format
}
