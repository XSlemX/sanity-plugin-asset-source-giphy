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
  shouldAutoPlayPreview = false,
}: GiphySelectorProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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
        shouldAutoPlayPreview={shouldAutoPlayPreview}
      >
        <Dialog
          width={200}
          header={"Giphy Image Asset Source"}
          onClose={onClose}
          id={"giphy-dialog"}
        >
          <SearchControls />
          <Container width={100} padding={4}>
            <>
              <ResultGifs onItemClick={onDialogOpen} />
              {dialogOpen && <GiphyById onClose={onDialogClose} />}
            </>
          </Container>
        </Dialog>
      </GiphyProvider>
    </ThemeProvider>
  );
}
