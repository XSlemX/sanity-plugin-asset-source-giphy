import React, { useEffect, useMemo, useRef, useState } from "react";
import VideoPreview from "./VideoPreview";
import { GiphyResult, RelatedGif } from "../types";
import Masonry from "./Masonry";
import { Flex100Center } from "./shared.styled";

type GifGridProps = {
  items: GiphyResult[] | RelatedGif[];
  onItemClick: (id: string) => void;
};

const steps = 248;
const initial = 500;
const count = 8;
const gutter = 5;
const sizeConfig = [
  { columns: 10, gutter: 5, minWidth: 1800 },
  ...Array(count)
    .fill(0)
    .map((_, i) => ({
      minWidth: Math.floor(steps * i + initial),
      mq: `${steps * i + initial}px`,
      columns: Math.floor((initial + i * steps) / steps),
      gutter,
    })),
];

const GifGrid = ({ items, onItemClick }: GifGridProps) => {
  const container = useRef(null);
  const [ratio, setRatio] = useState<number>(1);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const containerWidth = entries[0]?.contentRect.width;
      const windowWidth = window?.innerWidth ?? containerWidth;
      const rt = windowWidth / containerWidth;
      setRatio(rt);
    })
  );

  useEffect(() => {
    let localRef: React.MutableRefObject<Element | null> = {
      current: null,
    };
    if (container.current) {
      observer.current.observe(container.current);
      localRef.current = container.current as Element;
    }

    // Workaround to allow unobserve of already cleaned up dom element.
    if (container.current)
      return () => {
        if (localRef.current) {
          observer.current.unobserve(localRef.current!);
        }
      };
  }, [container, observer]);

  // This hacky guy is to reduce the breakpoints cause brick is using window width
  const sizes = useMemo(
    () =>
      sizeConfig.map((size) => {
        return {
          ...size,
          mq: `${size.minWidth * ratio}px`,
        };
      }),
    [ratio]
  );
  return (
    <Flex100Center align={"center"} justify={"center"} ref={container}>
      <Masonry sizes={sizes}>
        {items?.map((result) => (
          <VideoPreview
            title={result.title}
            type={"webd"}
            src={result.images.fixed_width.url!}
            height={result.images.fixed_width.height}
            width={result.images.fixed_width.width}
            onClick={() => onItemClick(result.id)}
            key={result.id}
            user={result.user}
          />
        ))}
      </Masonry>
    </Flex100Center>
  );
};

export default GifGrid;
