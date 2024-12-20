import { RegisterUserRequestDto } from '@applications/dtos/authentication/register-user-request.dto';
import { UserAccount } from '@domains/entities';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';
import { HashHelper } from '@shared/helpers';

export class RegisterUseCases implements UseCase<RegisterUserRequestDto, UserAccount> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  @Transactional({
    replication: true,
    isolationLevel: IsolationLevel.READ_COMMITTED,
  })
  public async execute(dto: RegisterUserRequestDto): Promise<UserAccount> {
    const userAccountModel = await this.unitOfWork
      .getUserAccountRepository()
      .createUserAccountWithLoginData(dto.email, await HashHelper.encrypt(dto.password));

    return userAccountModel;
  }
}
