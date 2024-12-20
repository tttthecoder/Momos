import { TokenDto } from '@applications/dtos/authentication/token.dto';
import { IJwtService, JwtPayload } from '@domains/adapters/jwt.interface';
import { UserTokenType } from '@domains/common/token';
import { JWTConfig } from '@domains/config/jwt.interface';
import { UserAccount, UserToken } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';
import { JwtHelper } from '@shared/helpers';

export class GenerateAccessTokenFromRefreshTokenUseCase
  implements UseCase<{ user: UserAccount; payload: JwtPayload }, TokenDto>
{
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly jwtConfig: JWTConfig,
    private readonly jwtTokenService: IJwtService,
  ) {}

  @Transactional({
    replication: true,
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
  })
  public async execute(input: { user: UserAccount; payload: JwtPayload }): Promise<TokenDto> {
    const { payload, user } = input;

    const accessToken = await this.generateJwtToken({ uuid: payload.uuid, hasVerify2FA: payload.hasVerify2FA });
    const userTokenModel = new UserToken();
    userTokenModel.userAccountId = user.id;
    userTokenModel.type = UserTokenType.Access;
    userTokenModel.token = accessToken;
    userTokenModel.expiredAt = await JwtHelper.getExpiredDate(accessToken);

    await this.unitOfWork.getUserTokenRepository().updateUserToken(userTokenModel);

    const result: TokenDto = {
      tokenType: this.jwtConfig.getJwtType(),
      accessToken: accessToken,
      accessTokenExpires: this.jwtConfig.getJwtExpirationTime(),
    };

    return result;
  }

  private async generateJwtToken(payload: JwtPayload) {
    const accessTokenExpires = this.jwtConfig.getJwtExpirationTime();
    const accessTokenSecret = this.jwtConfig.getJwtSecret();
    const token = this.jwtTokenService.createToken(payload, accessTokenSecret, accessTokenExpires);
    return token;
  }
}
