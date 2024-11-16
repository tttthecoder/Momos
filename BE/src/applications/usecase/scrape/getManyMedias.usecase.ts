import { MediaModel } from '@domains/entities/media.model';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { Pagination } from '@shared/helpers';
import { PaginationRequest, PaginationResponseDto } from '@shared/pagination';

export class GetManyMediasUseCase implements UseCase<PaginationRequest, PaginationResponseDto<MediaModel>> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(pagination: PaginationRequest): Promise<PaginationResponseDto<MediaModel>> {
    const { page, limit, skip } = pagination;

    const [jobs, total] = await this.unitOfWork.getMediaRepository().getMediasAndCount(pagination);

    return Pagination.of({ limit, page, skip }, total, jobs);
  }
}
