import React from "react";
import {
  Badge,
  Box,
  Dialog,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
} from "@sanity/ui";
import VideoPreview from "./VideoPreview";
import { GiphyResult } from "../types";
import Verified from "./Verified";
import { getToneByRating } from "./utils/getToneByRating";
import { useQuery } from "react-query";
import { getById } from "../lib/giphyClient";
import RelatedGifs from "./RelatedGifs";
import { GiphyUserImage, Spacer } from "./shared.styled";
import { useGiphyContext } from "../context/GiphyProvider";
import ImageSelectOptions from "./ImageSelectOptions";

type SelectedItemDialogProps = {
  onClose: () => void;
};

type DialogHeaderProps = {
  item: GiphyResult;
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

const GiphyById = ({ onClose }: SelectedItemDialogProps) => {
  const { selectedGifId, apiKey } = useGiphyContext();

  const { data, isLoading } = useQuery<GiphyResult>(
    ["selected", selectedGifId],
    () => getById(selectedGifId!, apiKey),
    {
      enabled: !!selectedGifId,
    }
  );

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
        <Flex
          justify={"space-between"}
          align="center"
          direction={"column"}
          gap={5}
          width={1}
        >
          <Grid columns={2} width={1}>
            <VideoPreview
              autoPlay
              src={data?.images.original.mp4!}
              type={"preview"}
              previewHeight={data?.images.original.height}
            />
            <ImageSelectOptions data={data!} />
          </Grid>
          <RelatedGifs />
        </Flex>
      </Box>
    </Dialog>
  );
};

export default GiphyById;
