import React, { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "./useDebounce";
import Preview from "./Preview";
import {
  Dialog,
  Button,
  Card,
  TextInput as Input,
  Container,
  Heading,
  studioTheme,
  Spinner,
  ThemeProvider,
  Inline,
  Radio,
  Label,
  Flex,
  Stack,
} from "@sanity/ui";
import { GiphyAssetSourceConfig } from ".";
import { GiphyResult, ImageTypes } from "./types";
import NoApiKeyWarning from "./NoApiKeyWarning";
import { AssetSourceComponentProps } from "sanity";

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
});

const ratings = ["ALL", "G", "PG", "PG-13", "R"].map((r) => ({
  title: r,
  value: r.toLowerCase(),
}));

interface GiphySelectorProps
  extends GiphyAssetSourceConfig,
    AssetSourceComponentProps {}

export default function Giphy({
  onClose,
  onSelect,
  apiKey,
  autoPlayAllowed = false,
}: GiphySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState(ratings[0]);
  const [results, setResults] = useState<GiphyResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [text, setText] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isTrendingResult, setIsTrendingResult] = useState(true);

  const debounced = useDebounce(searchTerm, 500);

  useEffect(() => {
    setHasApiKey(!!apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (debounced && debounced.length >= 3) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [debounced]);

  useEffect(() => {
    if (isTrendingResult) {
      handleTrendingClick();
    } else {
      handleSearch();
    }
  }, [rating]);

  const search = (searchType: string = "search", params: any = {}) => {
    return instance
      .get(`/${searchType}`, {
        params: {
          q: debounced,
          api_key: apiKey,
          limit: 24,
          rating: rating.value === "all" ? "" : rating.value,
          ...params,
        },
      })
      .then((response) => response.data)
      .then((data) => data.data);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setIsTrendingResult(false);
    search()
      .then((data) => console.log(data))
      .then(() => {
        setText(`Showing result for ${debounced}`);
        setIsSearching(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const handleRandomClick = () => {
    setIsSearching(true);
    search("random", {}).then((result: GiphyResult) => {
      chooseItem(result, "original");
    });
    setIsSearching(false);
  };

  const handleTrendingClick = () => {
    setIsTrendingResult(true);
    setIsSearching(true);
    setSearchTerm("");
    search("trending")
      .then((results: GiphyResult[]) => {
        setText("Showing result for Trending");
        setResults(results);
        return results;
      })
      .then(() => {
        setIsSearching(false);
      });
  };

  const chooseItem = (item: GiphyResult, image: ImageTypes) => {
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

  if (!hasApiKey) {
    return <NoApiKeyWarning />;
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
            <Input
              placeholder={"Type phrase here"}
              id={"searchInput"}
              onChange={handleChange}
              value={searchTerm}
              onClear={() => setSearchTerm("")}
              clearButton
            />
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
              {isSearching ? (
                <Spinner muted />
              ) : (
                <Flex wrap={"wrap"} gap={5}>
                  {results
                    .filter(
                      (result) =>
                        result.rating === rating.value || rating.value === "all"
                    )
                    .map((result, index: number) => (
                      <Preview
                        autoPlay={autoPlayAllowed}
                        src={result.images.preview.mp4}
                        item={result}
                        onClick={chooseItem}
                        key={index}
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
