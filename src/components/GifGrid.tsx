import React from "react";
import { Flex } from "@sanity/ui";
import VideoPreview from "./VideoPreview";
import { GiphyResult, RelatedGif } from "../types";

type GifGridProps = {
  items: GiphyResult[] | RelatedGif[];
  onItemClick: (id: string) => void;
};

const GifGrid = ({ items, onItemClick }: GifGridProps) => {
  return (
    <Flex wrap={"wrap"} gap={5}>
      {items?.map((result) => (
        <VideoPreview
          type={"tile"}
          src={result.images.preview.mp4!}
          onClick={() => onItemClick(result.id)}
          key={result.title}
          user={result.user}
        />
      ))}
    </Flex>
  );
};

export default GifGrid;
