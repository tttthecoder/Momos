import { Inject, Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { IMediaRepository } from '@domains/repositories/media.repository.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, Repository } from 'typeorm';
import { MediaModel } from '@domains/entities';
import { MediaEntity } from '@infrastructures/entities/media.entity';
import { PaginationRequest } from '@shared/pagination';

@Injectable()
export class MediaEntityRepository extends AbstractRepository<MediaEntity> implements IMediaRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  get getMediaRepository(): Repository<MediaEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(MediaEntity);
    }
    return this.dataSource.getRepository(MediaEntity);
  }

  async createMedias(dtos: Pick<MediaModel, 'description' | 'title' | 'type' | 'url'>[]): Promise<MediaModel[]> {
    const entity = await this.getMediaRepository.save(dtos.map((e) => new MediaEntity({ ...e })));

    return entity.map((e) => e?.toModel());
  }

  public async getMediasAndCount(pagination: PaginationRequest): Promise<[medias: MediaModel[], totalMedias: number]> {
    const { skip, limit, order, search, params } = pagination;

    let query = this.getMediaRepository.createQueryBuilder();

    // Apply filters if search exist
    query = this.applySearchFilters(query, search);

    // Apply filters if params exist
    query = this.applyParamFilters(query, params);

    // Apply sorting
    query = this.applyOrder(query, order);

    // Handle page and skip
    query = query.skip(skip).take(limit);

    const [medias, totalMedias] = await query.getManyAndCount();

    return [medias.map((media) => media.toModel()), totalMedias];
  }
}
