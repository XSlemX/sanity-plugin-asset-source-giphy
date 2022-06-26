import React from "react";
import { Flex, Spinner } from "@sanity/ui";
import GifGrid from "./GifGrid";
import { useGiphyContext } from "../context/GiphyProvider";
import GiphyStatusText from "./GiphyStatusText";
import styled from "styled-components";

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
    <Flex direction={"column"} align={"center"} gap={5} width={"100%"}>
      <GiphyStatusText />
      <ResultGifsContainer>
        {isLoading ? (
          <Spinner muted />
        ) : (
          <GifGrid items={items!} onItemClick={handleItemClick} />
        )}
      </ResultGifsContainer>
    </Flex>
  );
};

const ResultGifsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default ResultGifs;
