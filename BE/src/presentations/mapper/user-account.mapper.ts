import { UserAccountEntity } from 'src/infrastructures/entities/user-account.entity';
import { UserAccountResponseDto } from '../../applications/dtos/user-account/user-account-response.dto';
import { UserAccount } from '@domains/entities';

export class UserAccountMapper {
  public static toEntity(): UserAccountEntity {
    const entity = new UserAccountEntity();

    return entity;
  }

  public static toDto(entity: UserAccount): UserAccountResponseDto {
    const dto = new UserAccountResponseDto();
    dto.id = entity.uuid;
    dto.email = entity.email;
    return dto;
  }
}
