import {
  ApiSuccessResponse,
  MediaItem,
  PaginationRequest,
  PaginationResponseDto,
} from "@/types";

function buildQueryString(params: PaginationRequest): string {
  const { page, limit, order, filter } = params;

  const filterParams: any = {};
  filter &&
    Object.keys(filter).forEach((key) => {
      if (filter[`${key}`]) {
        filterParams[`${key}`] = filter[`${key}`];
      }
    });

  const query: Record<string, string> = {
    limit: limit.toString(),
    page: page.toString(),
    ...(order ? { order: JSON.stringify(order) } : {}),
    ...filterParams,
  };

  return new URLSearchParams(query).toString();
}

export default async function fetchPaginatedDataMedias(
  paginationRequest: PaginationRequest
): Promise<ApiSuccessResponse<PaginationResponseDto<MediaItem>>> {
  const queryString = buildQueryString(paginationRequest);
  const response = await fetch(
    process.env.NEXT_PUBLIC_BE_HOST + `/api/v1/scrape?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Error: HTTP ${response.status}, ${response.statusText}, Message: ${errorBody}`
    );
  }
  return await response.json();
}
