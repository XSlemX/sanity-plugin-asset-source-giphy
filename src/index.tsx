import { AssetSourceComponentProps, createPlugin } from "sanity";
import { QueryClient, QueryClientProvider } from "react-query";
import Giphy from "./Giphy";
import Icon from "./Icon";
import { studioTheme, ThemeProvider } from "@sanity/ui";
import GiphyProvider from "./context/GiphyProvider";

export interface GiphyAssetSourceConfig {
  apiKey: string;
}

const queryClient = new QueryClient({});

export const giphyAssetSourcePlugin = createPlugin<GiphyAssetSourceConfig>(
  (config) => {
    return {
      name: "asset-source-giphy",
      form: {
        image: {
          assetSources: (prev) => {
            return [
              ...prev,
              {
                name: "giphy",
                title: "Giphy",
                component: function component(
                  props: AssetSourceComponentProps
                ) {
                  const { selectedAssets } = props;
                  return (
                    <QueryClientProvider client={queryClient}>
                      <ThemeProvider theme={studioTheme}>
                        <GiphyProvider
                          {...props}
                          {...config}
                          previouslySelectedGifId={
                            selectedAssets?.[0]?.source?.id
                          }
                        >
                          <Giphy />
                        </GiphyProvider>
                      </ThemeProvider>
                    </QueryClientProvider>
                  );
                },
                icon: Icon,
              },
            ];
          },
        },
      },
    };
  }
);
