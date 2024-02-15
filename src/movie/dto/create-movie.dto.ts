import { Director } from 'src/schemas/director.schema';
import { Genre } from 'src/schemas/genre.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie name, may be repeated',
    example: 'Home Alone',
    required: true,
  })
  name: string;
  @ApiProperty({
    description: 'Year when movie was created',
    example: '2001',
  })
  year: number;
  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: '121',
  })
  duration: number;
  @ApiPropertyOptional({
    type: () => Genre,
    default: [],
    isArray: true,
    description: 'List of the movie genres',
  })
  genre?: Genre;
  @ApiPropertyOptional({
    type: () => Director,
    default: [],
    isArray: true,
    description: 'List of the movie directors',
  })
  director?: Director;
}
