import { useState } from 'react';
import { MediaObject } from '../Media';

type Photo = {
  id: number;
  alt_description: string;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  links: {
    html: string;
  };
  user: {
    links: {
      self: string;
      html: string;
    };
    username: string;
    name: string;
  };
};

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

const NUM_OF_IMAGES = 24;

export default function Unsplash({ setMedia }: Props): JSX.Element {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<[Photo]>();

  const handleSearch = async () => {
    const res = await (
      await fetch(`/api/unsplash?per_page=${NUM_OF_IMAGES}&query=${query}`)
    ).json();

    setResults(res.results);
  };

  return (
    <>
      <div className="flex w-full md:w-4/5 justify-center items-center mx-auto">
        <div className="flex w-full">
          <div className="flex w-full flex-col gap-2">
            <input
              className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          results.map((image, index) => {
            return (
              <div
                key={image.id}
                className="brick not-prose"
                onClick={() =>
                  setMedia({
                    type: 'image',
                    src: image.urls.regular,
                    alt: image.alt_description,
                    caption: `Photo by <a href="${image.user.links.html}" target="_blank" rel="noopener noreferrer">${image.user.name}</a> on <a href="${image.links.html}" target="_blank" rel="noopener noreferrer">Unsplash</a>`,
                  })
                }
              >
                <div>
                  <img
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
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

Unsplash.defaultProps = defaultProps;
