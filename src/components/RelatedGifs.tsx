import React from "react";
import { useQuery } from "react-query";
import { RelatedGif } from "../types";
import { getRelatedGifs } from "../lib/giphyClient";
import { Flex, Heading, Spinner } from "@sanity/ui";
import GifGrid from "./GifGrid";
import { useGiphyContext } from "../context/GiphyProvider";
import { Flex100Center } from "./shared.styled";

type RelatedGifsProps = {};

const RelatedGifs = ({}: RelatedGifsProps) => {
  const { selectedGifId, apiKey, handleGifClick } = useGiphyContext();
  const { data, isLoading } = useQuery<RelatedGif[]>(
    [`related-${selectedGifId}`, "related"],
    () => getRelatedGifs(selectedGifId!, apiKey),
    {
      enabled: !!selectedGifId,
    }
  );

  if (isLoading) {
    return <Spinner muted />;
  }

  return (
    <Flex100Center
      gap={5}
      justify={"center"}
      align={"center"}
      direction={"column"}
    >
      <Heading type={"h3"}>Related Gifs</Heading>
      <GifGrid items={data!} onItemClick={handleGifClick} />
    </Flex100Center>
  );
};

export default RelatedGifs;
