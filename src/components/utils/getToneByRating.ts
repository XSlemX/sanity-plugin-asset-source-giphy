import { GiphyRating, Tone } from "../../types";

const ratingToToneMap = {
  [GiphyRating.G]: Tone.positive,
  [GiphyRating.PG]: Tone.primary,
  [GiphyRating["PG-13"]]: Tone.caution,
  [GiphyRating.R]: Tone.critical,
};

export function getToneByRating(rating: GiphyRating): Tone {
  if (rating in ratingToToneMap) {
    return ratingToToneMap[rating];
  }

  return Tone.default;
}
