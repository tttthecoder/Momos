import { IsEmail, IsNotEmpty, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class RegisterUserRequestDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    description: 'The email address associated with the user account.',
    required: true,
  })
  email: string;

  // in real world application, we would validate the body according to the DTO. however this is for demo testing so that tester can test the app with ease
  // @Matches(passwordRegex, { message: 'Password too weak' })
  @IsNotEmpty()
  // @Length(6, 20)
  @ApiProperty({
    example: 'Admin@123',
    required: true,
    type: 'string',
    description: 'The password associated with the user account.',
  })
  password: string;
}
