import React, { useMemo } from "react";
import { Heading } from "@sanity/ui";
import { SearchTypes } from "../types";
import { useGiphyContext } from "../context/GiphyProvider";

const GiphyStatusText = () => {
  const { items, error, isLoading, selectedSearchType, searchTerm } =
    useGiphyContext();

  const text = useMemo(() => {
    if (!items && !error) {
      return "Type to search for GIFs";
    }
    if (selectedSearchType === SearchTypes.Search) {
      return `${
        isLoading ? "Searching" : "Showing results"
      } for "${searchTerm}"`;
    }

    return `${
      isLoading ? "Searching" : "Showing results"
    } for ${selectedSearchType}`;
  }, [selectedSearchType, searchTerm, isLoading]);
  return <Heading>{text}</Heading>;
};

export default GiphyStatusText;
