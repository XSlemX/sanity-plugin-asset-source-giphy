import React from "react";
import { Flex, Spinner } from "@sanity/ui";
import GifGrid from "./GifGrid";
import { useGiphyContext } from "../context/GiphyProvider";
import GiphyStatusText from "./GiphyStatusText";

type ResultGifsProps = {
  onItemClick: (id: string) => void;
};

const ResultGifs = ({ onItemClick }: ResultGifsProps) => {
  const { items, handleGifClick, isLoading } = useGiphyContext();

  const handleItemClick = (id: string) => {
    handleGifClick(id);
    onItemClick(id);
  };

  return (
    <Flex direction={"column"} gap={5}>
      <GiphyStatusText />
      <Flex justify="center">
        {isLoading ? (
          <Spinner muted />
        ) : (
          <GifGrid items={items!} onItemClick={handleItemClick} />
        )}
      </Flex>
    </Flex>
  );
};

export default ResultGifs;
