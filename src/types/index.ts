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
  images: {
    original: {
      height: string;
      width: string;
      size: string;
      url: string;
      mp4_size: string;
      mp4: string;
      webp_size: string;
      webp: string;
      frames: string;
      hash: string;
    };
    downsized: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    downsized_large: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    downsized_medium: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    downsized_small: {
      height: string;
      width: string;
      mp4_size: string;
      mp4: string;
    };
    downsized_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    fixed_height: {
      height: string;
      width: string;
      size: string;
      url: string;
      mp4_size: string;
      mp4: string;
      webp_size: string;
      webp: string;
    };
    fixed_height_downsampled: {
      height: string;
      width: string;
      size: string;
      url: string;
      webp_size: string;
      webp: string;
    };
    fixed_height_small: {
      height: string;
      width: string;
      size: string;
      url: string;
      mp4_size: string;
      mp4: string;
      webp_size: string;
      webp: string;
    };
    fixed_height_small_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    fixed_height_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    fixed_width: {
      height: string;
      width: string;
      size: string;
      url: string;
      mp4_size: string;
      mp4: string;
      webp_size: string;
      webp: string;
    };
    fixed_width_downsampled: {
      height: string;
      width: string;
      size: string;
      url: string;
      webp_size: string;
      webp: string;
    };
    fixed_width_small: {
      height: string;
      width: string;
      size: string;
      url: string;
      mp4_size: string;
      mp4: string;
      webp_size: string;
      webp: string;
    };
    fixed_width_small_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    fixed_width_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    looping: {
      mp4_size: string;
      mp4: string;
    };
    original_still: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    original_mp4: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    preview: {
      height: string;
      width: string;
      mp4: string;
      mp4_size: string;
    };
    preview_gif: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    preview_webp: {
      height: string;
      width: string;
      size: string;
      url: string;
    };
    "480w_still": {
      height: string;
      width: string;
      size: string;
      url: string;
    };
  };
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
