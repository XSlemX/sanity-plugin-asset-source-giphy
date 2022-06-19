import React, { createContext, useState } from "react";
import { GiphyRating, GiphyResult, ImageTypes, SearchTypes } from "../types";
import { useQuery } from "react-query";
import { getGifsByTerm, getRandom, getTrending } from "../lib/giphyClient";
import { AssetFromSource } from "sanity";
import { AxiosError } from "axios";

type GiphyContextProps = {
  selectedGifId?: string | null;
  selectedRating?: GiphyRating;
  selectedSearchType?: SearchTypes;
  searchTerm?: string;
  apiKey: string;
  items?: GiphyResult[];
  isLoading?: boolean;
  error?: AxiosError;
  handleSearch: (term: string) => void;
  handleRandomClick: () => void;
  handleTrendingClick: () => void;
  handleRatingChange: (rating: GiphyRating) => void;
  handleGifClick: (gifId: string) => void;
  shouldAutoPlayPreview: boolean;
};

const Context = createContext<GiphyContextProps>({
  selectedGifId: null,
  selectedRating: GiphyRating.G,
  selectedSearchType: SearchTypes.Trending,
  apiKey: "",
  shouldAutoPlayPreview: false,
  handleSearch: (term: string) => {},
  handleGifClick: (gifId: string) => {},
  handleRandomClick: () => {},
  handleRatingChange: (rating: GiphyRating) => {},
  handleTrendingClick: () => {},
});

type GiphyProviderProps = {
  children: React.ReactNode;
  apiKey: string;
  onSelect: (assetFromSource: AssetFromSource[]) => void;
  shouldAutoPlayPreview: boolean;
};
const GiphyProvider = ({
  children,
  apiKey,
  onSelect,
  shouldAutoPlayPreview,
}: GiphyProviderProps) => {
  const [selectedGifId, setSelectedGifId] = React.useState<string | null>(null);
  const [selectedRating, setSelectedRating] = React.useState<GiphyRating>(
    GiphyRating.G
  );
  const [selectedSearchType, setSelectedSearchType] =
    React.useState<SearchTypes>(SearchTypes.Trending);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery<GiphyResult[], any>(
    ["giphy", searchTerm, selectedSearchType, selectedRating],
    () => {
      switch (selectedSearchType) {
        case SearchTypes.Search:
          return getGifsByTerm(searchTerm, apiKey, selectedRating);
        case SearchTypes.Trending:
          return getTrending(apiKey, selectedRating);
        case SearchTypes.Random:
        case SearchTypes.Related:
        default:
          return Promise.resolve([]);
      }
    }
  );

  const handleSearch = (term: string) => {
    setSelectedSearchType(SearchTypes.Search);
    setSearchTerm(term);
  };

  const handleRandomClick = () => {
    getRandom(apiKey).then(handleSelect);
  };

  const handleTrendingClick = () => {
    setSelectedSearchType(SearchTypes.Trending);
  };

  const handleRatingChange = (rating: GiphyRating) => {
    setSelectedRating(rating);
  };

  const handleGifClick = (gifId: string) => {
    setSelectedGifId(gifId);
  };

  const handleSelect = (
    item: GiphyResult,
    image: ImageTypes = ImageTypes.Original
  ) => {
    console.log("Choosing", item);
    if (!(image in item.images)) {
      console.warn("No such image on this item", image);
      return;
    }

    onSelect([
      {
        kind: "url",
        value: item.images[image].url,
      },
    ]);
  };

  return (
    <Context.Provider
      value={{
        handleSearch,
        handleGifClick,
        handleRandomClick,
        handleTrendingClick,
        handleRatingChange,
        selectedRating,
        selectedGifId,
        selectedSearchType,
        apiKey,
        items: data,
        error,
        isLoading,
        shouldAutoPlayPreview,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useGiphyContext() {
  return React.useContext(Context);
}

export default GiphyProvider;
