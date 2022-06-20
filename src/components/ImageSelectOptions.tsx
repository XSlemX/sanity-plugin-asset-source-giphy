import React, { useMemo } from "react";
import { Button, Flex, Heading } from "@sanity/ui";
import {
  GiphyImageItem,
  GiphyResult,
  ImageTypes,
  SupportedImageTypes,
  Tone,
} from "../types";
import { useGiphyContext } from "../context/GiphyProvider";
import prettyBytes from "pretty-bytes";

const formatImageLabel = (name: string) =>
  `${name.substring(0, 1).toUpperCase()}${name
    .substring(1)
    .replaceAll("_", " ")}`;

type Entry = GiphyImageItem & {
  key: string;
  isStill: Boolean;
  sizeText: string;
};
type ImageSelectOptionsProps = {
  data: GiphyResult;
};
const ImageSelectOptions = ({ data }: ImageSelectOptionsProps) => {
  const { handleSelect } = useGiphyContext();
  const entries = useMemo<Entry[]>(() => {
    if (!data?.images) {
      return [];
    }
    return Object.entries(data.images)
      .filter(([key, value]) => {
        return SupportedImageTypes.includes(key as ImageTypes);
      })
      .map(([key, value]) => {
        return {
          ...value,
          key,
          isStill: key.includes("still"),
          sizeText: prettyBytes(parseInt(value.size?.toString() ?? "0", 10)),
        };
      })
      .sort((a, b) => {
        return a.size! < b.size! ? 1 : -1;
      })
      .sort((a, b) => {
        if (a.isStill && !b.isStill) {
          return -1;
        }
        return 0;
      });
  }, [data]);
  return (
    <Flex direction={"column"} gap={2} align={"center"} justify={"center"}>
      <Heading type={"h3"}>Download options</Heading>
      {entries?.map((image) => (
        <Button
          width={1}
          onClick={() => handleSelect(data, image.key as ImageTypes)}
          mode="default"
          tone={image.isStill ? Tone.primary : Tone.positive}
          text={`${formatImageLabel(image.key)} (${image.sizeText})`}
        />
      ))}
    </Flex>
  );
};

export default ImageSelectOptions;
