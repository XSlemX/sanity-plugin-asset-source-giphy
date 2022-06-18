type GiphyImageItem = {
  url: string;
  mp4?: string;
};
export interface GiphyResult {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: Record<ImageTypes, GiphyImageItem>;
  user: {
    avatar_url: string;
    banner_image: string;
    banner_url: string;
    profile_url: string;
    username: string;
    display_name: string;
    description: string;
    instagram_url: string;
    website_url: string;
    is_verified: true;
  };
  analytics_response_payload: string;
  analytics: {
    onload: {
      url: string;
    };
    onclick: {
      url: string;
    };
    onsent: {
      url: string;
    };
  };
}

export enum ImageTypes {
  FourEightyStill = "480w_still",
  OriginalMp4 = "original_mp4",
  OriginialStill = "original_still",
  Original = "original",
  Preview = "preview",
  PreviewGif = "preview_gif",
  PreviewWebp = "preview_webp",
  Downsized = "downsized",
  DownsizedLarge = "downsized_large",
  DownsizedMedium = "downsized_medium",
  DownsizedStill = "downsized_still",
  FixedHeight = "fixed_height",
  FixedHeightDownsampled = "fixed_height_downsampled",
  FixedHeightSmall = "fixed_height_small",
  FixedHeightSmallStill = "fixed_height_small_still",
  FixedHeightStill = "fixed_height_still",
  FixedWidth = "fixed_width",
  FixedWidthDownsampled = "fixed_width_downsampled",
  FixedWidthSmall = "fixed_width_small",
  FixedWidthSmallStill = "fixed_width_small_still",
  FixedWidthStill = "fixed_width_still",
}

export enum SearchTypes {
  Search = "search",
  Trending = "trending",
  Random = "random",
}
