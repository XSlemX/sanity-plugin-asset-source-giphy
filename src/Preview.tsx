import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Button,
  Card,
  Badge,
  Heading,
  Text,
  Box,
  Tooltip,
  Select,
  Avatar,
  Flex,
  Grid,
} from "@sanity/ui";
import styled from "styled-components";
import { GiphyResult } from "./types";

interface PreviewProps {
  src: string;
  item: GiphyResult;
  onClick: (item: GiphyResult, type: string) => void;
  autoPlay?: boolean;
}

const formatImageLabel = (name: string) =>
  `${name.substring(0, 1).toUpperCase()}${name
    .substring(1)
    .replaceAll("_", " ")}`;

export default function Preview({
  src,
  item,
  onClick,
  autoPlay = false,
}: PreviewProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [k, keySet] = useState("original");
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      return;
    }
    if (video.current) {
      if (play) {
        video.current.play();
      } else {
        video.current.pause();
      }
    }
  }, [play, autoPlay]);

  const entries = Object.entries(item.images).map(([key, value]: any) => ({
    ...value,
    key,
    isStill: key.includes("still"),
  }));

  const tone = useMemo(() => {
    switch (item.rating) {
      case "g":
        return "positive";
      case "pg":
        return "primary";
      case "pg-13":
        return "caution";
      case "r":
        return "critical";
      default:
        return "default";
    }
  }, [item]);

  if (!src) {
    return null;
  }
  return (
    <Container>
      <Card padding={1} radius={1} shadow={1} tone="primary">
        <Flex justify="space-between" align="center">
          {item.user ? (
            <Avatar
              alt={item.user.description}
              color="magenta"
              src={item.user.avatar_url}
              size={1}
            />
          ) : (
            <Avatar alt={"n/a"} color="red" size={1} title={"n/a"} />
          )}
          <Heading as="h3" size={1}>
            <Tooltip
              content={
                <Box padding={2}>
                  <Text muted size={1}>
                    {item.title}
                  </Text>
                </Box>
              }
              fallbackPlacements={["right", "left"]}
              placement="top"
              portal
            >
              <span style={{ display: "inline-block" }}>
                {item.title.substring(0, 20)}
              </span>
            </Tooltip>
          </Heading>
          <Badge tone={tone}>{item.rating}</Badge>
        </Flex>
      </Card>
      <Video
        ref={video}
        onMouseEnter={() => setPlay(true)}
        onMouseLeave={() => setPlay(false)}
        src={src}
        autoPlay={autoPlay}
        loop
      />
      <Grid columns={2} width={"100%"}>
        <Select onChange={(e) => keySet(e.currentTarget.value)}>
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
        <Button
          onClick={() => onClick(item, k)}
          mode="default"
          tone="positive"
          text={`Select ${formatImageLabel(k)}`}
        />
      </Grid>
    </Container>
  );
}
const Container = styled.div`
  border-radius: 10px;
  width: 300px;
  background-color: blanchedalmond;
`;

const Video = styled.video`
  width: 300px;
  height: 200px;
  object-fit: cover;
`;
