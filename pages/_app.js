import '../styles/globals.css';
import '../lib/configureAmplify';
import Script from 'next/script';

// Note: The tab component was causing an useOnLayout warning
// https://stackoverflow.com/a/58173551/6775987
import React from 'react';
React.useLayoutEffect = React.useEffect;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="//cdn.iframe.ly/embed.js" strategy="beforeInteractive" />
      <Script
        src="//cdn.embedly.com/widgets/platform.js"
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
