import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { JWTConfig } from '@domains/config/jwt.interface';
import { JwtPayload } from '@domains/adapters/jwt.interface';
import { InvalidCredentialsException, InvalidTokenException } from '@shared/exceptions';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly userAccountRepository: IUserAccountRepository,
    private consigService: JWTConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies && request?.cookies[consigService.getJwtRefreshCookieKey()];
        },
      ]),
      secretOrKey: consigService.getJwtRefreshSecret(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const { uuid } = payload;
    const refreshToken = request.cookies[this.consigService.getJwtRefreshCookieKey()];
    const userAccount = await this.userAccountRepository.findOneByUUID(uuid);

    if (!userAccount) {
      throw new InvalidCredentialsException();
    }

    if (userAccount.tokens.findIndex((token) => token.token === refreshToken) === -1) {
      throw new InvalidTokenException();
    }

    (request as any).jwtPayload = payload;

    return userAccount;
  }
}
