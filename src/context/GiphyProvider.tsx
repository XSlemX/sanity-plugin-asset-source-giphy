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
  handleSelect: (item: GiphyResult, image: ImageTypes) => void;
};

const Context = createContext<GiphyContextProps>({
  selectedGifId: null,
  selectedRating: GiphyRating.G,
  selectedSearchType: SearchTypes.Trending,
  apiKey: "",
  handleSearch: (term: string) => {},
  handleGifClick: (gifId: string) => {},
  handleRandomClick: () => {},
  handleRatingChange: (rating: GiphyRating) => {},
  handleTrendingClick: () => {},
  handleSelect: () => {},
});

type GiphyProviderProps = {
  children: React.ReactNode;
  apiKey: string;
  onSelect: (assetFromSource: AssetFromSource[]) => void;
  previouslySelectedGifId?: string | null;
};
const GiphyProvider = ({
  children,
  apiKey,
  onSelect,
  previouslySelectedGifId,
}: GiphyProviderProps) => {
  console.log("Prev", previouslySelectedGifId);
  const [selectedGifId, setSelectedGifId] = React.useState<string | null>(
    previouslySelectedGifId ?? null
  );
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
    console.log("Choosing", item, image);
    if (!(image in item.images)) {
      console.warn("No such image on this item", image);
      return;
    }

    const giphy = item.images[image];

    onSelect([
      {
        kind: "url",
        value: giphy.url,
        // @ts-ignore
        assetDocumentProps: {
          _id: item.id,
          source: {
            id: item.id,
            name: item.title,
            url: item.url,
          },
        },
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
        handleSelect,
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
