import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '';

export default function Iframely(props) {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    async function getHtml() {
      const apiUrl = `https://iframe.ly/api/iframely?url=${props.url}&api_key=${API_KEY}&iframe=1&omit_script=1`;
      const res = await axios(apiUrl);
      const html = res.data.html;
      setHtml(html);
    }
    getHtml();
    // @ts-ignore
    window.iframely && iframely.load();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
