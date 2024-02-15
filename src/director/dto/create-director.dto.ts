import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectorDto {
  @ApiProperty({
    description: "Director's full name",
    example: 'Steven Spielberg',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "Director's birth date",
    example: '1946-12-18',
    required: true,
  })
  birthday: Date;
}
