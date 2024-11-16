import { ApiProperty } from '@nestjs/swagger';
import { FORMAT_DATETIME } from '@shared/common/constants';
import { MediaType } from '@shared/common/enums/media-type.enum';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class MediaRepsonseDto {
  @ApiProperty({
    example: '39c75bb2-73c9-4e9b-a994-5991d5f38469',
    description: 'The UUID of the media.',
    type: 'string',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Amazing Image',
    description: 'The title of the image.',
    type: 'string',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Develop and maintain software applications.',
    description: 'A description of the image.',
    type: 'string',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'http://example.com/some-image',
    description: 'A url of the image',
    type: 'string',
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: 'http://example.com',
    description: 'the url of the website',
    type: 'string',
  })
  @IsString()
  siteUrl: string;

  @ApiProperty({
    example: 'IMAGE',
    description: 'type of the media',
    type: 'enum',
  })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({
    example: '2024-08-01T00:00:00Z',
    description: 'The date and time when the media was scraped',
    type: FORMAT_DATETIME,
  })
  @IsDate()
  createdAt: Date;
}

