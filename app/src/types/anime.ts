export interface AnimeDetails {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  year: number;
  season: string;
  studios: { name: string }[];
  genres: { name: string }[];
  aired: {
    from: string;
    to: string;
  };
}

export interface HistoricalData {
  dates: string[];
  scores: number[];
  ranks: number[];
  members: number[];
  reviews: { positive: number; negative: number }[];
} 