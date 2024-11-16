import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ScrapeURLsRequest {
  @ApiProperty({
    example: 'https://example.com',
    description: 'a URL to scrape.',
    type: String,
  })
  // the requirements was "Create an API which will accept an array for Web URL in the request Body.". I did it initially but realized that we have to
  // loop over the strings in the array=> taking CPU time! So i changed to just a string instead of array of strings => only 1 step of validation
  @IsNotEmpty()
  // minimal validation possible => avoid draining CPU time.
  @IsString()
  // @IsUrl() this is nice but we should not do this here
  url: string;
}

