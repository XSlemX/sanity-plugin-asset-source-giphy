import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import Preview from "./Preview";
import {
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Heading,
  Inline,
  Label,
  Radio,
  Spinner,
  Stack,
  studioTheme,
  TextInput,
  ThemeProvider,
} from "@sanity/ui";
import { GiphyAssetSourceConfig } from ".";
import { GiphyResult, ImageTypes, SearchTypes } from "./types";
import NoApiKeyWarning from "./NoApiKeyWarning";
import { AssetSourceComponentProps } from "sanity";
import { useQuery } from "react-query";

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
});

instance.interceptors.response.use((response) => response.data);

const ratings = ["G", "PG", "PG-13", "R"].map((r) => ({
  title: r,
  value: r.toLowerCase(),
}));

type GiphySelectorProps = GiphyAssetSourceConfig & AssetSourceComponentProps;

export default function Giphy({
  onClose,
  onSelect,
  apiKey,
  shouldAutoPlayPreview = false,
}: GiphySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState(ratings[0]);
  const input = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState<SearchTypes>(
    SearchTypes.Trending
  );

  const search = (
    term: string,
    type: SearchTypes,
    rating: string = "g",
    limit: number = 24
  ) =>
    instance
      .get(`/${type}`, {
        params: {
          ...(type === SearchTypes.Search && { q: searchTerm }),
          api_key: apiKey,
          limit,
          rating,
        },
      })
      .then((data) => data.data);

  const { data, error, isLoading } = useQuery<GiphyResult[]>(
    ["giphy", searchTerm, searchType, rating.value],
    () => search(searchTerm, searchType, rating.value),
    {
      enabled:
        !!apiKey &&
        searchType !== SearchTypes.Random && // handled manually
        ((searchType === SearchTypes.Search && !!searchTerm) ||
          searchType === SearchTypes.Trending),
    }
  );

  const text = useMemo(() => {
    if (!data && !error) {
      return "Type to search for GIFs";
    }
    if (searchType === SearchTypes.Search) {
      return `${
        isLoading ? "Searching" : "Showing results"
      } for "${searchTerm}"`;
    }

    return `${isLoading ? "Searching" : "Showing results"} for ${searchType}`;
  }, [searchType, searchTerm, isLoading]);

  const handleClick = () => {
    setSearchType(SearchTypes.Search);
    setSearchTerm(input?.current?.value!);
  };

  const handleRandomClick = () => {
    search("", SearchTypes.Random, rating.value).then(chooseItem);
  };

  const handleTrendingClick = () => {
    setSearchType(SearchTypes.Trending);
  };

  const chooseItem = (
    item: GiphyResult,
    image: ImageTypes = ImageTypes.Original
  ) => {
    console.log("Choosing", item);
    if (!item.images.hasOwnProperty(image)) {
      console.warn("No such image on this item", image);
      return;
    }

    onSelect([
      {
        kind: "url",
        value: item.images[image].url,
      },
    ]);
  };

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  function handleSubmit() {
    handleClick();
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <Dialog
        width={200}
        header={"Giphy Image Source"}
        onClose={onClose}
        id={"giphy-dialog"}
        title={"Testing"}
      >
        <Card padding={4}>
          <Stack space={4}>
            <form onSubmit={handleClick}>
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
                  onClick={handleClick}
                />
              </Flex>
            </form>
            <Inline space={3}>
              {ratings.map((r) => (
                <Label size={3}>
                  <Inline space={1}>
                    {r.title}
                    <Radio
                      defaultChecked={r.value === rating.value}
                      name="rating"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setRating({ ...r })
                      }
                      value={r.value}
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
              </Inline>
            </Card>
          </Stack>
        </Card>
        <Container width={100} padding={4}>
          <Stack space={4}>
            <Heading>{text}</Heading>
            <Flex justify="center">
              {isLoading ? (
                <Spinner muted />
              ) : (
                <Flex wrap={"wrap"} gap={5}>
                  {data?.map((result) => (
                    <Preview
                      shouldAutoPlayPreview={shouldAutoPlayPreview}
                      src={result.images.preview.mp4!}
                      item={result}
                      onClick={chooseItem}
                      key={result.title}
                    />
                  ))}
                </Flex>
              )}
            </Flex>
          </Stack>
        </Container>
      </Dialog>
    </ThemeProvider>
  );
}
