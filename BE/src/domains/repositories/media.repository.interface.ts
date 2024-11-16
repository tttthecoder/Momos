import { MediaModel } from '@domains/entities';
import { PaginationRequest } from '@shared/pagination';

export interface IMediaRepository {
  createMedias(dtos: Pick<MediaModel, 'description' | 'title' | 'type' | 'url'>[]): Promise<MediaModel[]>;

  getMediasAndCount(pagination: PaginationRequest): Promise<[medias: MediaModel[], totalMedias: number]>;
}
