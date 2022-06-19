import React, { useMemo } from "react";
import {
  Badge,
  Box,
  Dialog,
  Flex,
  Grid,
  Heading,
  Select,
  Spinner,
  Text,
} from "@sanity/ui";
import VideoPreview from "./VideoPreview";
import { GiphyImageItem, GiphyResult } from "../types";
import Verified from "./Verified";
import { getToneByRating } from "./utils/getToneByRating";
import { useQuery } from "react-query";
import { getById } from "../lib/giphyClient";
import RelatedGifs from "./RelatedGifs";
import { GiphyUserImage, Spacer } from "./shared.styled";
import { useGiphyContext } from "../context/GiphyProvider";

type SelectedItemDialogProps = {
  onClose: () => void;
};

type DialogHeaderProps = {
  item: GiphyResult;
};

type Entry = GiphyImageItem & {
  key: string;
  isStill: Boolean;
};

const DialogHeader = ({ item }: DialogHeaderProps) => {
  const tone = getToneByRating(item?.rating);
  return (
    <Flex justify="flex-start" align="center">
      {item?.user && (
        <GiphyUserImage
          alt={item.user.description}
          src={item.user.avatar_url}
        />
      )}
      <Heading as="h3" size={1}>
        <Text>{item?.title}</Text>
      </Heading>
      <Spacer />
      {item?.user?.is_verified && <Verified />}
      <Badge tone={tone}>{item?.rating}</Badge>
    </Flex>
  );
};

const formatImageLabel = (name: string) =>
  `${name.substring(0, 1).toUpperCase()}${name
    .substring(1)
    .replaceAll("_", " ")}`;

const GiphyById = ({ onClose }: SelectedItemDialogProps) => {
  const { selectedGifId, apiKey } = useGiphyContext();

  const { data, isLoading } = useQuery<GiphyResult>(
    ["selected", selectedGifId],
    () => getById(selectedGifId!, apiKey),
    {
      enabled: !!selectedGifId,
    }
  );

  const entries = useMemo<Entry[]>(() => {
    if (!data?.images) {
      return [];
    }
    return Object.entries(data.images).map(([key, value]) => ({
      ...value,
      key,
      isStill: key.includes("still"),
    }));
  }, [data]);

  if (isLoading) {
    return <Spinner muted />;
  }

  return (
    <Dialog
      header={<DialogHeader item={data as GiphyResult} />}
      id="giphy-preview"
      onClose={onClose}
      width={100}
      zOffset={1000}
    >
      <Box padding={[3, 3, 4, 5]} width={1}>
        <Flex>
          <VideoPreview
            autoPlay
            src={data?.images.original.mp4!}
            type={"preview"}
            previewHeight={data?.images.original.height}
          />
          <Grid columns={2} width={"100%"}>
            <Select onChange={(e) => null}>
              <optgroup label={"GIF"}>
                {entries
                  .filter((image) => !image.isStill)
                  .map((image) => (
                    <option key={image.key} value={image.key}>
                      {formatImageLabel(image.key)}
                    </option>
                  ))}
              </optgroup>
              <optgroup label={"Still images"}>
                {entries
                  .filter((image) => image.isStill)
                  .map((image) => (
                    <option key={image.key} value={image.key}>
                      {formatImageLabel(image.key)}
                    </option>
                  ))}
              </optgroup>
            </Select>
          </Grid>
        </Flex>
        <RelatedGifs />
      </Box>
    </Dialog>
  );
};

export default GiphyById;
