import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MediaModel } from '@domains/entities';
import { MediaType } from '@shared/common/enums/media-type.enum';

@Entity({ name: 'media' })
// When user filter by type only, this index won't be used. But performance wise, mostly users will filter by siteURL or siteURL and type together, so this is good enough!
@Index('IDX_media_site_url_type', ['siteUrl', 'type']) // Composite index on 'url' and 'type'
@Index('IDX_media_title_description_fulltext', ['title', 'discription'], { fulltext: true }) // Full-text index on 'title' and 'discription'
export class MediaEntity extends MediaModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid' })
  uuid: string;

  @Column({
    name: 'discription',
    type: 'varchar',
    length: 2000,
    nullable: true,
    default: null,
  })
  discription: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MediaType,
    nullable: false,
  })
  type: MediaType;

  @Column({
    name: 'url',
    type: 'varchar',
    nullable: false,
  })
  url: string;

  @Column({
    name: 'site_url',
    type: 'varchar',
    nullable: false,
  })
  siteUrl: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 2000,
    default: null,
    nullable: true,
  })
  title: string;

  @Column(() => BaseEntity, { prefix: false })
  baseEntity: BaseEntity;

  toModel(): MediaModel {
    const model = new MediaModel();
    model.id = this.id;
    model.uuid = this.uuid;
    model.url = this.url;
    model.siteUrl = this.siteUrl;
    model.title = this.title;
    model.description = this.description;
    model.type = this.type;
    model.createdAt = this.baseEntity.createdAt;
    model.deletedAt = this.baseEntity.deletedAt;
    model.updatedAt = this.baseEntity.updatedAt;

    return model;
  }
}
