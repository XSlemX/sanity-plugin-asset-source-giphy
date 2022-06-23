import { AssetSourceComponentProps, createPlugin } from "sanity";
import { QueryClient, QueryClientProvider } from "react-query";
import Giphy from "./Giphy";
import Icon from "./Icon";

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
          assetSources: (prev, ctx) => {
            return [
              ...prev,
              {
                name: "giphy",
                title: "Giphy",
                component: function component(
                  props: AssetSourceComponentProps
                ) {
                  console.log(props);
                  return (
                    <QueryClientProvider client={queryClient}>
                      <Giphy {...props} {...config} />;
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
