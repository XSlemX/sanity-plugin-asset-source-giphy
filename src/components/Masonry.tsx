// Taken from https://github.com/sergiop/react-giphy-searchbox/blob/master/src/components/MasonryLayout/MasonryLayout.js

import React, { Children, useEffect, useRef } from "react";
import Bricks, { SizeDetail } from "bricks.js";

type Props = {
  children: React.ReactNode;
  sizes: Array<SizeDetail>;
};

const Masonry = ({ children, sizes }: Props) => {
  const container = useRef(null);
  const bricks = useRef<Bricks.Instance>();
  useEffect(() => {
    if (container.current !== null) {
      bricks.current = Bricks({
        container: container.current,
        packed: "data-packed",
        sizes,
        position: true,
      });

      bricks.current.resize(true);

      if (Children.count(children) > 0) {
        bricks.current.pack();
      }
    }
  }, [children, container, sizes]);

  return <div ref={container}>{children}</div>;
};

export default Masonry;
