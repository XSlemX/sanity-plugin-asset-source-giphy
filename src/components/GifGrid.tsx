import React from "react";
import { Flex } from "@sanity/ui";
import VideoPreview from "./VideoPreview";
import { GiphyResult, RelatedGif } from "../types";
import { useGiphyContext } from "../context/GiphyProvider";

type GifGridProps = {
  items: GiphyResult[] | RelatedGif[];
  onItemClick: (id: string) => void;
};

const GifGrid = ({ items, onItemClick }: GifGridProps) => {
  const { shouldAutoPlayPreview } = useGiphyContext();
  return (
    <Flex wrap={"wrap"} gap={5} justify={"center"}>
      {items?.map((result) => (
        <VideoPreview
          type={"tile"}
          src={result.images.preview.mp4!}
          onClick={() => onItemClick(result.id)}
          key={result.title}
          user={result.user}
          autoPlay={shouldAutoPlayPreview}
        />
      ))}
    </Flex>
  );
};

export default GifGrid;
