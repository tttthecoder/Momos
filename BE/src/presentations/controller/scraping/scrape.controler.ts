import { UseCase } from '@domains/usecase/usecase.interface';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGlobalResponse,
  ApiPaginatedRequest,
  ApiPaginatedResponse,
  PaginationParams,
  SkipAuth,
} from '@shared/decorators';
import { SuccessResponseDto } from '@shared/dtos';
import { ScrapeURLsRequest } from '@applications/dtos/scrape/scrape-urls-request.dto';
import { MediaRepsonseDto } from '@applications/dtos/scrape/media-response.dto';
import { MediaEntity } from '@infrastructures/entities/media.entity';
import { PaginationRequest, PaginationResponseDto } from '@shared/pagination';
import { MediaModel } from '@domains/entities';
import { MediaMapper } from '@presentations/mapper/media.mapper';

@ApiTags('Scrape')
@Controller({
  path: 'scrape',
  version: '1',
})
export class ScrapeController {
  constructor(
    @Inject(UsecasesProxyProvide.QueueURLs)
    private readonly queueURLsUseCase: UseCaseProxy<UseCase<{ urls: string[] }, SuccessResponseDto>>,
    @Inject(UsecasesProxyProvide.GetManyMedias)
    private readonly getMediasUseCase: UseCaseProxy<UseCase<PaginationRequest, PaginationResponseDto<MediaModel>>>,
  ) {}

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: 'Request To Scrape Web URLS' })
  @Post('/scrape')
  @HttpCode(200)
  public async scrape(@Body() requestDto: ScrapeURLsRequest): Promise<SuccessResponseDto> {
    // await here will add more delay into the flow => making users wait on request in expectation of 5000 concurrent requests is not a good idea => no need to await
    this.queueURLsUseCase
      .getInstance()
      .execute({ urls: [requestDto.url] })
      .catch((e) => console.error(e)); //do need to catch to avoid breaking the app since. this is called late uncaught promise
    return { result: true };
  }

  @ApiPaginatedResponse(MediaRepsonseDto)
  @ApiPaginatedRequest(MediaEntity)
  @ApiOperation({ description: 'Get Medias List' })
  @SkipAuth()
  @Get('')
  @HttpCode(200)
  public async getManyMedias(
    @PaginationParams(MediaEntity) params: PaginationRequest,
  ): Promise<PaginationResponseDto<MediaRepsonseDto>> {
    const { content, ...rest } = await this.getMediasUseCase.getInstance().execute(params);
    return {
      content: content.map(MediaMapper.toDto),
      ...rest,
    };
  }
}

