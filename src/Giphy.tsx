import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "@sanity/ui";
import NoApiKeyWarning from "./NoApiKeyWarning";
import GiphyById from "./components/GiphyById";
import SearchControls from "./components/SearchControls";
import { useGiphyContext } from "./context/GiphyProvider";
import ResultGifs from "./components/ResultGifs";

export default function Giphy() {
  const { selectedGifId, apiKey, handleClose, handleGifClick } =
    useGiphyContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(!!selectedGifId);
  const onDialogClose = useCallback(() => {
    handleGifClick(undefined);
    setDialogOpen(false);
  }, []);
  const onDialogOpen = useCallback(() => setDialogOpen(true), []);

  useEffect(() => {
    if (selectedGifId && !dialogOpen) {
      setDialogOpen(true);
    }
  }, [selectedGifId, dialogOpen]);

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  return (
    <Dialog
      width={200}
      header={"Giphy Image Asset Source"}
      onClose={handleClose}
      id={"giphy-dialog"}
    >
      <SearchControls />
      <ResultGifs onItemClick={onDialogOpen} />
      {dialogOpen && <GiphyById onClose={onDialogClose} />}
    </Dialog>
  );
}
