# sanity-plugin-asset-source-giphy

Plugin for [Sanity Studio](https://www.sanity.io) providing a Giphy asset source

## Installation

In your studio folder, run:

```
sanity install asset-source-giphy
```

Then create an app to get a valid [Giphy API key](https://developers.giphy.com/dashboard/?create=true) into ``./config/asset-source-giphy.json``.

The config file has two props:

```javascript
{
  "apiKey": "yourkeyhere",
  "autoPlayAll": false
}
```

`apiKey` is _required_, but `autoPlayAll` is optional and `false` is its default value


