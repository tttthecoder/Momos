import { MediaType } from '@shared/common/enums/media-type.enum';

export class MediaModel {
  constructor(data?: Partial<MediaModel>) {
    Object.assign(this, { ...data });
  }
  id: number;
  uuid: string;
  type: MediaType;
  url: string;
  siteUrl: string;
  description: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
