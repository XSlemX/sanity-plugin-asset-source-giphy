import React from "react";
import { useQuery } from "react-query";
import { RelatedGif } from "../types";
import { getRelatedGifs } from "../lib/giphyClient";
import { Container, Heading, Spinner, Stack } from "@sanity/ui";
import GifGrid from "./GifGrid";
import { useGiphyContext } from "../context/GiphyProvider";

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
    <Stack>
      <Heading type={"h3"}>Related Gifs</Heading>
      <GifGrid items={data!} onItemClick={handleGifClick} />
    </Stack>
  );
};

export default RelatedGifs;
