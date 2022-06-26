import React, { useCallback, useState } from "react";
import { Container, Dialog, studioTheme, ThemeProvider } from "@sanity/ui";
import { GiphyAssetSourceConfig } from ".";
import NoApiKeyWarning from "./NoApiKeyWarning";
import { AssetSourceComponentProps } from "sanity";
import GiphyById from "./components/GiphyById";
import SearchControls from "./components/SearchControls";
import GiphyProvider from "./context/GiphyProvider";
import ResultGifs from "./components/ResultGifs";

type GiphySelectorProps = GiphyAssetSourceConfig & AssetSourceComponentProps;

export default function Giphy({
  onClose,
  onSelect,
  apiKey,
  selectedAssets,
}: GiphySelectorProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(
    !!selectedAssets?.[0]?.source?.id
  );
  const onDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);
  const onDialogOpen = useCallback(() => setDialogOpen(true), []);

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  return (
    <ThemeProvider theme={studioTheme}>
      <GiphyProvider
        apiKey={apiKey}
        onSelect={onSelect}
        previouslySelectedGifId={selectedAssets?.[0]?.source?.id}
      >
        <Dialog
          width={200}
          header={"Giphy Image Asset Source"}
          onClose={onClose}
          id={"giphy-dialog"}
        >
          <SearchControls />
          <ResultGifs onItemClick={onDialogOpen} />
          {dialogOpen && <GiphyById onClose={onDialogClose} />}
        </Dialog>
      </GiphyProvider>
    </ThemeProvider>
  );
}
