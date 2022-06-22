import React from "react";
import { Flex, Heading, Text } from "@sanity/ui";
import styled from "styled-components";
import { GiphyUser } from "../types";
import Verified from "./Verified";
import { GiphyUserImage } from "./shared.styled";

interface VideoPreviewProps {
  src?: string;
  title?: string;
  autoPlay?: boolean;
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
  autoPlay = true,
  showUserTooltip = true,
}: VideoPreviewProps) {
  if (!src) {
    console.log("Received no url", title);
    return null;
  }

  const minWidth = Math.max(width, 248);
  const mHeight = (height / width) * minWidth;
  return (
    <Container width={minWidth} height={mHeight}>
      {/*<SmallVideo onClick={onClick} src={src} autoPlay={autoPlay} loop />*/}
      {type === "webd" && (
        <picture onClick={onClick}>
          <source type="image/webp" srcSet={src} />
          <Tile alt={title} src={src} width={minWidth} />
        </picture>
      )}
      {type === "mp4" && <video loop autoPlay src={src} />}

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

const SmallVideo = styled.video`
  border-radius: 4px;
  width: 300px;
  height: 200px;
  object-fit: cover;
`;

const Tile = styled.img`
  border-radius: 4px;
  width: 248px;
  height: auto;
  object-fit: cover;
`;

const BigContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const BigVideo = styled.video<{ previewHeight: number }>`
  width: auto;
  height: ${(props) => props.previewHeight}px;
  object-fit: cover;
`;

const Preview = styled.img<{ previewHeight: number }>`
  width: auto;
  height: ${(props) => props.previewHeight}px;
  object-fit: cover;
`;
