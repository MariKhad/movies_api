import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({
    description: 'Title of playlist, may be repeated',
    example: 'New Year Comedies',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: "Array of movie Ids, can't be repeated",
    required: true,
    default: [],
    isArray: true,
  })
  movies: string[];

  @ApiPropertyOptional({
    description: 'Id of creater of the playlist',
    required: true,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Public/private flag, playlist is private by default',
    required: true,
    default: false,
  })
  isPublic: boolean;
}
