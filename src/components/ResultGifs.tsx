import React from "react";
import { Spinner } from "@sanity/ui";
import GifGrid from "./GifGrid";
import { useGiphyContext } from "../context/GiphyProvider";
import GiphyStatusText from "./GiphyStatusText";
import { Flex100Center } from "./shared.styled";

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
    <Flex100Center
      direction={"column"}
      align={"center"}
      justify={"center"}
      gap={5}
    >
      <GiphyStatusText />
      {isLoading ? (
        <Spinner muted />
      ) : (
        <GifGrid items={items!} onItemClick={handleItemClick} />
      )}
    </Flex100Center>
  );
};

export default ResultGifs;
