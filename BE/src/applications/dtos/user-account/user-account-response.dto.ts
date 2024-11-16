import { ApiProperty } from '@nestjs/swagger';

export class UserAccountResponseDto {
  @ApiProperty({
    example: '39c75bb2-73c9-4e9b-a994-5991d5f38469',
    description: 'The unique identifier of the user account.',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address associated with the user account.',
  })
  email: string;

  // more properties can be added here!
}
