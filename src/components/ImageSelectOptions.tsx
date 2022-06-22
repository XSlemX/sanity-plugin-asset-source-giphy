import React, { useMemo } from "react";
import { Button, Flex, Heading } from "@sanity/ui";
import {
  GiphyImageItem,
  GiphyResult,
  ImageTypes,
  SupportedImageTypes,
} from "../types";
import { useGiphyContext } from "../context/GiphyProvider";
import prettyBytes from "pretty-bytes";

const formatImageLabel = (name: string) =>
  `${name.substring(0, 1).toUpperCase()}${name
    .substring(1)
    .replaceAll("_", " ")}`;

const colors = ["#fff35c", "#00ccff", "#9934ff", "#ff6667", "#08ff99"];
function getColor(index: number, offset: number) {
  return colors[
    (colors.length + index + (offset % colors.length)) % colors.length
  ];
}
type Entry = GiphyImageItem & {
  key: string;
  isStill: Boolean;
  text: string;
  backgroundColor: string;
  color: string;
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
      .map(([key, value], index) => {
        const size = prettyBytes(parseInt(value.size?.toString() ?? "0", 10));
        console.log("size", size, "valuesize", value.size);
        return {
          ...value,
          key,
          isStill: key.includes("still"),
          text: `${formatImageLabel(key)} (${size})`,
          backgroundColor: getColor(index, 0),
          color: getColor(index, 4),
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
    <Flex direction={"column"} gap={2}>
      <Heading type={"h3"}>Download options</Heading>
      {entries?.map((entry) => (
        <button
          onClick={() => handleSelect(data, entry.key as ImageTypes)}
          style={{
            backgroundColor: entry.backgroundColor,
            color: entry.color,
            width: 200,
            height: 48,
            borderRadius: 4,
            fontSize: "1rem",
          }}
        >
          <span>{entry.text}</span>
        </button>
      ))}
    </Flex>
  );
};

export default ImageSelectOptions;
