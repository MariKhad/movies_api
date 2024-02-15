import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Genre name, should be unique',
    example: 'Comedy',
    required: true,
  })
  name: string;
}
