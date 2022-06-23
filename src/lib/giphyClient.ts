import axios from "axios";
import { GiphyRating, GiphyResult, RelatedGif, SearchTypes } from "../types";

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
});

instance.interceptors.response.use((response) => response.data?.data);

type SearchProps = {
  apiKey: string;
  type: SearchTypes;
  term?: string;
  gif_id?: string;
  rating?: GiphyRating;
  limit?: number | null;
};
const search = ({
  term = "",
  type,
  gif_id,
  rating = GiphyRating.G,
  apiKey,
  limit = 24,
}: SearchProps): Promise<GiphyResult[]> =>
  instance.get(`/${type}`, {
    params: {
      api_key: apiKey,
      ...(type === SearchTypes.Search && term && { q: term }),
      ...(limit && { limit }),
      ...(rating && { rating }),
      ...(gif_id && { gif_id }),
    },
  });

export function getById(id: string, apiKey: string): Promise<GiphyResult> {
  return instance.get(`/${id}`, {
    params: {
      api_key: apiKey,
    },
  });
}

export function getRandom(
  apiKey: string,
  rating: GiphyRating = GiphyRating.G
): Promise<GiphyResult> {
  return instance.get(`/random`, {
    params: {
      api_key: apiKey,
      rating,
    },
  });
}

export function getTrending(
  apiKey: string,
  rating: GiphyRating = GiphyRating.G
): Promise<GiphyResult[]> {
  return search({ type: SearchTypes.Trending, rating, apiKey });
}

export function getGifsByTerm(
  term: string,
  apiKey: string,
  rating: GiphyRating = GiphyRating.G
): Promise<GiphyResult[]> {
  return search({ term, type: SearchTypes.Search, rating, apiKey });
}

export function getRelatedGifs(
  gif_id: string,
  apiKey: string
): Promise<RelatedGif[]> {
  return instance.get(`/related`, {
    params: {
      api_key: apiKey,
      gif_id,
    },
  });
}
