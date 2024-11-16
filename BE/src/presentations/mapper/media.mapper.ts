import { MediaModel } from '@domains/entities';
import { MediaEntity } from '@infrastructures/entities/media.entity';
import { MediaRepsonseDto } from '@applications/dtos/scrape/media-response.dto';
export class MediaMapper {
  public static toDto(model: MediaModel | MediaEntity): MediaRepsonseDto {
    const dto = new MediaRepsonseDto();
    dto.id = model.uuid;
    dto.title = model.title;
    dto.description = model.description;
    dto.siteUrl = model.siteUrl;
    dto.url = model.url;
    dto.type = model.type;
    dto.createdAt = model.createdAt;
    return dto;
  }
}

