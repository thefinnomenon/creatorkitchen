import '../styles/globals.css';
import 'react-complex-tree/lib/style.css';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';
import { configureAmplify } from '../lib/amplify';

// Note: The tab component was causing an useOnLayout warning
// https://stackoverflow.com/a/58173551/6775987
React.useLayoutEffect = React.useEffect;

// Initial app configurations
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    async function configure() {
      await configureAmplify();
    }
    configure();
  }, []);

  return (
    <>
      <Script src="//cdn.iframe.ly/embed.js" strategy="beforeInteractive" />
      <Script src="//cdn.embedly.com/widgets/platform.js" strategy="beforeInteractive" />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
