import React from "react";
import { Flex, Heading, Text } from "@sanity/ui";
import styled from "styled-components";
import { GiphyUser } from "../types";
import Verified from "./Verified";
import { GiphyUserImage } from "./shared.styled";

interface VideoPreviewProps {
  src: string;
  autoPlay?: boolean;
  type: "tile" | "preview";
  onClick?: () => void;
  previewHeight?: number;
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
  type,
  onClick,
  user,
  previewHeight = 272,
  autoPlay = true,
}: VideoPreviewProps) {
  if (!src) {
    return null;
  }

  if (type === "preview") {
    return (
      <BigContainer>
        <BigVideo
          src={src}
          autoPlay={autoPlay}
          loop
          previewHeight={previewHeight}
        />
      </BigContainer>
    );
  }

  return (
    <SmallContainer>
      <SmallVideo onClick={onClick} src={src} autoPlay={autoPlay} loop />
      <Hover>
        <VideoTooltip user={user!} />
      </Hover>
    </SmallContainer>
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

const SmallContainer = styled.div`
  width: 300px;
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

const BigContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const BigVideo = styled.video<{ previewHeight: number }>`
  width: 500px;
  height: ${(props) => props?.previewHeight ?? 272}px;
  object-fit: cover;
`;
