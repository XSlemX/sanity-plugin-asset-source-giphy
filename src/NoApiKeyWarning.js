import React from "react"

const NoApiKeyWarning = () => {
  return (
    <div>
      <h2>Missing configuration</h2>
      <p>You must first configure the plugin with your Giphy credentials</p>
      <p>
        Edit the <code>./config/asset-source-giphy.json</code> file in your Sanity Studio
        folder.
      </p>
      <p>
        You can get your credentials by visiting the{' '}
        <a href="https://developers.giphy.com/dashboard" rel="noopener noreferrer" target="_blank">
          Giphy developer dashboard
        </a>{' '}
        and get create an app to receive your key
      </p>
    </div>
  )
}

export default NoApiKeyWarning
