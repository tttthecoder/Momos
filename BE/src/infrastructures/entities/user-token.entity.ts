import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccountEntity } from './user-account.entity';
import { UserTokenType } from '@domains/common/token';
import { BaseEntity } from './base.entity';
import { UserToken } from '@domains/entities';

@Entity({ name: 'user_tokens' })
export class UserTokenEntity extends UserToken {
  // Constructor
  constructor(userToken?: Partial<UserTokenEntity>) {
    super();
    Object.assign(this, userToken);
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @Column({ name: 'user_account_id', type: 'bigint' })
  userAccountId: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: UserTokenType,
    nullable: false,
    default: UserTokenType.Access,
  })
  type: UserTokenType;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  token: string;

  @Column({
    name: 'expired_at',
    type: 'datetime',
    nullable: true,
  })
  expiredAt: Date;

  @ManyToOne(() => UserAccountEntity, (user) => user.tokens)
  @JoinColumn({ name: 'user_account_id' })
  user: UserAccountEntity;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  public toModel(): UserToken {
    const model = new UserToken();
    model.id = this.id;
    model.token = this.token;
    model.type = this.type;
    model.userAccountId = this.userAccountId;
    model.expiredAt = this.expiredAt;
    model.createdAt = this.baseEntity.createdAt;
    model.updatedAt = this.baseEntity.updatedAt;
    model.deletedAt = this.baseEntity.deletedAt;
    model.user = this?.user?.toModel() || null;

    return model;
  }
}
