import { useState } from 'react';
import { MediaObject } from '../Media';

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

const NUM_OF_IMAGES = 24;

export default function Giphy({ setMedia }: Props): JSX.Element {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState();

  const handleSearch = async () => {
    const res = await (
      await fetch(`/api/giphy?limit=${NUM_OF_IMAGES}&query=${query}`)
    ).json();

    setResults(res.results.data);
  };

  return (
    <>
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
      <div className="masonry mt-5">
        {results &&
          // @ts-ignore
          results.map((gif) => {
            return (
              <div
                key={gif.id}
                className="brick not-prose"
                onClick={() =>
                  setMedia({
                    type: 'image',
                    src: gif.images.original.url,
                    alt: gif.title,
                    caption: `${gif.title} from <a href="${gif.url}" target="_blank" rel="noopener noreferrer">Giphy</a>`,
                  })
                }
              >
                <div>
                  <img
                    key={gif.id}
                    src={gif.images.fixed_width_downsampled.url}
                    alt={gif.title}
                    className="not-prose"
                  />
                  {/* <a
                    src={image.user.links.self}
                    className="relative opacity-0 group-hover:opacity-100 ml-1 top-[-2rem] text-sm"
                  >
                    {image.user.name}
                  </a> */}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

Giphy.defaultProps = defaultProps;
