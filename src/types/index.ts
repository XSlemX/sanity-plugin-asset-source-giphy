export type GiphyImageItem = {
  url: string;
  mp4?: string;
  height?: number;
};

export interface GiphyUser {
  id: number;
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  name: string;
  attribution_display_name: string;
  description: string;
  user_type: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  twitter: string;
  tumblr_url: string;
  website_url: string;
  website_display_url: string;
  is_public: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  suppress_chrome: boolean;
}

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
  rating: GiphyRating;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: Record<ImageTypes, GiphyImageItem>;
  user: GiphyUser;
}

export interface RelatedGif {
  type: "gif";
  id: string;
  index_id: number;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: GiphyRating;
  content_url: string;
  tags: string[];
  featured_tags: string[];
  user_tags: [];
  source_tld: string;
  source_post_url: string;
  is_hidden: boolean;
  is_removed: boolean;
  is_community: boolean;
  is_anonymous: boolean;
  is_featured: boolean;
  is_realtime: boolean;
  is_sticker: boolean;
  import_datetime: string;
  trending_datetime: string;
  create_datetime: string;
  update_datetime: string;
  images: Record<string, GiphyImageItem>;
  user?: GiphyUser;
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
  Related = "related",
}

export enum GiphyRating {
  G = "g",
  PG = "pg",
  "PG-13" = "pg-13",
  R = "r",
}

export enum Tone {
  positive = "positive",
  primary = "primary",
  caution = "caution",
  critical = "critical",
  default = "default",
}
