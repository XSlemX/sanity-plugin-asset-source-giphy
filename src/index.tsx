import Giphy from "./Giphy";
import Icon from "./Icon";
import { createPlugin } from "sanity";

export interface GiphyAssetSourceConfig {
  apiKey: string;
  autoPlayAllowed: boolean;
}

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
                component: function component() {
                  return <Giphy {...config} />;
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
