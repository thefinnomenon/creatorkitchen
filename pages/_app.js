import '../styles/globals.css';
import '../lib/configureAmplify';

// Note: The tab component was causing an useOnLayout warning
// https://stackoverflow.com/a/58173551/6775987
import React from 'react';
React.useLayoutEffect = React.useEffect;

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
