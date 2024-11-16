export interface MediaItem {
  id: string;
  description?: string;
  title?: string;
  url: string;
  type: MediaType;
  createdAt: string;
  siteUrl: string;
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
