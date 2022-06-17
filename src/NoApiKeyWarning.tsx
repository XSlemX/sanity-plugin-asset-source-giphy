import React from "react";
import { Badge } from "@sanity/ui";

export default function NoApiKeyWarning() {
  return (
    <div>
      <Badge tone="critical">
        <strong>Missing configuration</strong>
      </Badge>

      <p>You must first configure the plugin with your Giphy credentials</p>
      <p>
        Edit the <code>sanity.config.ts/js</code> file in your Sanity Studio
        folder.
      </p>
      <p>
        You can get your credentials by visiting the{" "}
        <a
          href="https://developers.giphy.com/dashboard"
          rel="noopener noreferrer"
          target="_blank"
        >
          Giphy developer dashboard
        </a>{" "}
        and get create an app to receive your key
      </p>
    </div>
  );
}
