import { useEffect, useState } from 'react';
import { MediaObject } from '../Media';

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Unsplash({ setMedia }: Props): JSX.Element {
  const [query, setQuery] = useState('');
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');

  const handleSearch = async () => {
    console.log(query);
    const results = await (await fetch(`/api/unsplash?query=${query}`)).json();
    console.log(results);
  };

  const handleSet = () => {
    setMedia({ type: 'image', src, alt });
    setQuery('');
    setSrc('');
    setAlt('');
  };

  return (
    <div className="flex w-full md:w-4/5 justify-center items-center mx-auto">
      <div className="flex w-full">
        <div className="flex w-full flex-col gap-2">
          <input
            className="appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="search"
            type="text"
            value={query}
            // @ts-ignore
            onInput={(e) => setQuery(e.target.value)}
            placeholder={'Search'}
          />
          <button
            onClick={() => handleSearch()}
            className="flex-2 flex-shrink-0 text-sm font-bold bg-blue-500 hover:bg-blue-700 hover:border-blue-900  text-white  py-2 px-6 rounded"
            type="button"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

Unsplash.defaultProps = defaultProps;
