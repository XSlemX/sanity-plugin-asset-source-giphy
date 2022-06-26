import React, { useEffect, useRef } from "react";
import {
  Button,
  Card,
  Flex,
  Inline,
  Label,
  Radio,
  Stack,
  TextInput,
} from "@sanity/ui";
import { useGiphyContext } from "../context/GiphyProvider";
import { GiphyRating, ImageTypes } from "../types";
import GiphyPreview from "./GiphyPreview";

const SearchControls = () => {
  const input = useRef<HTMLInputElement>(null);
  const {
    handleSearch,
    handleTrendingClick,
    handleRandomClick,
    selectedRating,
    handleRatingChange,
    handleGifClick,
    previouslySelectedGifId,
  } = useGiphyContext();
  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [input]);

  function handleCurrentAssetClick() {
    handleGifClick(previouslySelectedGifId!);
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <form onSubmit={() => handleSearch(input?.current?.value!)}>
          <Flex>
            <Card flex={1}>
              <TextInput
                ref={input}
                width={"100%"}
                placeholder={"Type phrase here"}
                id={"searchInput"}
                onClear={handleTrendingClick}
                fontSize={[2, 2, 3]}
                padding={[3, 3, 4]}
                clearButton
              />
            </Card>
            <Button
              fontSize={[2, 2, 3]}
              padding={[3, 3, 4]}
              text="Search"
              tone="primary"
              onClick={() => handleSearch(input?.current?.value!)}
            />
          </Flex>
        </form>
        <Inline space={3}>
          {[
            GiphyRating.G,
            GiphyRating.PG,
            GiphyRating["PG-13"],
            GiphyRating.R,
          ].map((rating) => (
            <Label size={3}>
              <Inline space={1}>
                {rating}
                <Radio
                  defaultChecked={rating == selectedRating}
                  name="rating"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRatingChange(rating)
                  }
                  value={rating}
                />
              </Inline>
            </Label>
          ))}
        </Inline>

        <Card>
          <Inline space={[3, 3, 4]}>
            <Button
              fontSize={[2, 2, 3]}
              mode="ghost"
              padding={[3, 3, 4]}
              text="See trending"
              onClick={handleTrendingClick}
            />
            <Button
              fontSize={[2, 2, 3]}
              padding={[3, 3, 4]}
              text="I feel lucky"
              tone="primary"
              onClick={handleRandomClick}
            />
            {previouslySelectedGifId && (
              <Button
                fontSize={[2, 2, 3]}
                padding={[3, 3, 4]}
                text="Open current"
                icon={
                  <GiphyPreview
                    gifId={previouslySelectedGifId}
                    type={ImageTypes.PreviewGif}
                    maxHeight={30}
                  />
                }
                tone="primary"
                mode={"bleed"}
                onClick={handleCurrentAssetClick}
              />
            )}
          </Inline>
        </Card>
      </Stack>
    </Card>
  );
};

export default SearchControls;
