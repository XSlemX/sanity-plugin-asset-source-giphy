import React from "react";
import { Flex, Heading, Text } from "@sanity/ui";
import styled from "styled-components";
import { GiphyUser } from "../types";
import Verified from "./Verified";
import { GiphyUserImage } from "./shared.styled";

interface VideoPreviewProps {
  src?: string;
  title?: string;
  showUserTooltip?: boolean;
  type: "webd" | "mp4";
  onClick?: () => void;
  height: number;
  width: number;
  user?: GiphyUser;
}

type VideoToolTipProps = {
  user: GiphyUser;
};

function VideoTooltip({ user }: VideoToolTipProps) {
  return (
    <Flex justify="flex-start" align="center">
      {user?.avatar_url ? (
        <GiphyUserImage alt={user?.description} src={user?.avatar_url} />
      ) : null}
      <Heading as="h3" size={1}>
        <Text>{user?.display_name ?? "Unknown"}</Text>
      </Heading>
      {user?.is_verified && <Verified />}
    </Flex>
  );
}

export default function VideoPreview({
  src,
  title,
  type,
  onClick,
  user,
  height,
  width,
  showUserTooltip = true,
}: VideoPreviewProps) {
  if (!src) {
    console.log("Received no url", title);
    return null;
  }

  const minWidth = Math.max(width, type === "webd" ? 248 : 480);
  const mHeight = (height / width) * minWidth;
  return (
    <Container width={minWidth} height={mHeight}>
      {type === "webd" && (
        <picture onClick={onClick}>
          <source type="image/webp" srcSet={src} />
          <Tile alt={title} src={src} width={minWidth} />
        </picture>
      )}
      {type === "mp4" && <Video loop autoPlay src={src} />}
      {showUserTooltip && (
        <Hover>
          <VideoTooltip user={user!} />
        </Hover>
      )}
    </Container>
  );
}

const Hover = styled.div`
  position: absolute;
  bottom: 0;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  height: 50px;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const Container = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;

  &:hover ${Hover} {
    opacity: 1;
  }
}
`;
const Tile = styled.img`
  border-radius: 4px;
  width: 248px;
  height: auto;
  object-fit: cover;
`;
const Video = styled.video`
  width: 100%;
`;
