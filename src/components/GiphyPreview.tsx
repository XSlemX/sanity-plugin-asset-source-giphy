import { GiphyResult, ImageTypes } from "../types";
import { useQuery } from "react-query";
import { getById } from "../lib/giphyClient";
import { useGiphyContext } from "../context/GiphyProvider";
import { useState } from "react";

type GiphyPreviewProps = {
  gifId: string;
  type: ImageTypes;
  maxHeight: number;
};

const GiphyPreview = ({ gifId, type, maxHeight = 40 }: GiphyPreviewProps) => {
  const { apiKey } = useGiphyContext();
  const { data, error, isLoading } = useQuery<GiphyResult, any>(
    ["giphy_preview", gifId],
    () => getById(gifId, apiKey),
    {
      enabled: !!gifId,
    }
  );
  const image = data?.images?.[type];
  if (!image) {
    return null;
  }
  const ratio = image.width / image.height;

  const height = Math.min(maxHeight, image.height);
  return (
    <img
      alt={data.title}
      src={image.url}
      height={height}
      width={ratio * height}
    />
  );
};

export default GiphyPreview;
