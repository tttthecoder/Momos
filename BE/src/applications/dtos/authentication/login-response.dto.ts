import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  @ApiProperty({
    type: () => TokenDto,
  })
  token: TokenDto;
}
