import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserAccount } from '@domains/entities';
import { UserTokenEntity } from './user-token.entity';

@Entity({ name: 'user_account' })
export class UserAccountEntity extends UserAccount {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  uuid: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  passwordHash: string;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  // Relationship
  @OneToMany(() => UserTokenEntity, (token) => token.user)
  tokens: UserTokenEntity[];

  toModel(): UserAccount {
    const model = new UserAccount();
    model.id = this.id;
    model.email = this.email;
    model.createdAt = this.baseEntity.createdAt;
    model.deletedAt = this.baseEntity.deletedAt;
    model.updatedAt = this.baseEntity.updatedAt;
    // model.userLoginExternals = this?.userLoginExternals?.map((e) => e?.toModel());
    model.tokens = this?.tokens?.map((e) => e?.toModel());
    model.uuid = this.uuid;
    return model;
  }
}
