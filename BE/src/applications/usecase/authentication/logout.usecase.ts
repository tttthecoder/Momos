import { IJwtService } from '@domains/adapters/jwt.interface';
import { UserAccount, UserToken } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';

export class LogoutUseCases implements UseCase<UserAccount, string> {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  @Transactional({
    replication: false,
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
  })
  public async execute(user: UserAccount): Promise<string> {
    const cookie = this.jwtTokenService.getLoggedOutCookieForJwtRefreshToken();
    try {
      const userTokens = await this.unitOfWork.getUserTokenRepository().getUserTokenListByUserAccountId(user.id);

      if (!userTokens || userTokens.length === 0) {
        return cookie;
      }
      const userTokenModel = new UserToken();
      userTokenModel.userAccountId = user.id;
      userTokenModel.type = null;
      userTokenModel.token = null;
      userTokenModel.expiredAt = null;

      await this.unitOfWork.getUserTokenRepository().updateUserToken(userTokenModel);

      return cookie;
    } catch (error) {
      return cookie;
    }
  }
}
