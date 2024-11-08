import { ArchiveResponse } from "./archive";

export interface AnimeData {
  title: string;
  synopsis: string;
  score: string;
  scoredBy: string;
  ranked: string;
  popularity: string;
  members: string;
  favorites: string;
  type: string;
  season: string;
}

export interface ScrapeAnimeRequest {
  url: string;
  date?: string;
}

export interface ScrapeAnimeResponse {
  archive: {
    archiveData: Omit<ArchiveResponse, 'html'>;
    animeData: AnimeData;
  };
}

export interface AnimeSearchParams {
  query: string;
  page?: number;
  limit?: number;
  type?: string;
  score?: number;
  status?: string;
  rating?: string;
  genres?: string;
  order_by?: string;
  sort?: 'asc' | 'desc';
}

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  score: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  status: string;
  type: string;
}