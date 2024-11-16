import { AuthCredentialsRequestDto } from '@applications/dtos/authentication/auth-credentials-request.dto';
import { RegisterUserRequestDto } from '@applications/dtos/authentication/register-user-request.dto';
import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { UserAccountResponseDto } from '@applications/dtos/user-account/user-account-response.dto';
import { UserAccountMapper } from '@presentations/mapper/user-account.mapper';
import { UserAccount } from '@domains/entities';
import { UseCase } from '@domains/usecase/usecase.interface';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Body, Controller, HttpCode, Inject, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiGlobalResponse, CurrentUser, SkipAuth } from '@shared/decorators';
import { SuccessResponseDto } from '@shared/dtos';
import { LoginResponseDto } from '@applications/dtos/authentication/login-response.dto';
import { TOKEN_NAME } from '@infrastructures/config/swagger/swagger.config';
import { JwtPayload } from '@domains/adapters/jwt.interface';
import JwtRefreshGuard from '@shared/guards/jwt-refresh.guard';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(
    @Inject(UsecasesProxyProvide.LoginUsecase)
    private readonly loginUsecase: UseCaseProxy<
      UseCase<AuthCredentialsRequestDto, { user: UserAccount; token: TokenDto; refreshTokenCookie: string }>
    >,
    @Inject(UsecasesProxyProvide.RegisterUseCase)
    private readonly registerUseCase: UseCaseProxy<UseCase<RegisterUserRequestDto, UserAccount>>,
    @Inject(UsecasesProxyProvide.LogoutUsecase)
    private readonly logoutUsecases: UseCaseProxy<UseCase<UserAccount, string>>,
    @Inject(UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase)
    private readonly generateAccessTokenFromRefreshTokenUseCase: UseCaseProxy<
      UseCase<{ user: UserAccount; payload: JwtPayload }, TokenDto>
    >,
  ) {}

  @ApiGlobalResponse(UserAccountResponseDto)
  @ApiOperation({ description: 'User Register' })
  @Post('/register')
  @HttpCode(200)
  @SkipAuth()
  public async register(
    @Body()
    registerDto: RegisterUserRequestDto,
  ): Promise<UserAccountResponseDto> {
    const userAccount = await this.registerUseCase.getInstance().execute(registerDto);
    return UserAccountMapper.toDto(userAccount);
  }

  @ApiGlobalResponse(LoginResponseDto)
  @ApiOperation({ description: 'User authentication' })
  @Post('/login')
  @HttpCode(200)
  @SkipAuth()
  public async login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto,
    @Request() request: any,
  ): Promise<LoginResponseDto> {
    const { refreshTokenCookie, ...data } = await this.loginUsecase.getInstance().execute(authCredentialsDto);

    request.res.setHeader('Set-Cookie', [refreshTokenCookie]);

    return {
      token: data.token,
    };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'User Logout' })
  @ApiBearerAuth(TOKEN_NAME)
  @Post('/logout')
  @HttpCode(200)
  public async logout(@CurrentUser() user: UserAccount, @Request() request: any): Promise<SuccessResponseDto> {
    const cookie = await this.logoutUsecases.getInstance().execute(user);
    request.res.setHeader('Set-Cookie', [cookie]);
    return {
      result: true,
    };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'User refresh token' })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  @ApiOkResponse({ description: 'token successfully renewed' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @SkipAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/token/refresh')
  @HttpCode(200)
  public async refreshToken(@Request() request: any): Promise<TokenDto> {
    return await this.generateAccessTokenFromRefreshTokenUseCase
      .getInstance()
      .execute({ user: request.user, payload: request.jwtPayload });
  }
}
