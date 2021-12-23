import { useState } from 'react';
import { MediaObject } from '../Media';

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function LinkOrUpload({ setMedia }: Props): JSX.Element {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');

  const determineTypeFromSrc = (source: string) => {
    const imgRegex = new RegExp('.?(jpe?g|png|gif|bmp)$', 'i');
    const videoRegex = new RegExp('.?(mov|avi|wmv|flv|3gp|mp4|mpg)$', 'i');

    if (imgRegex.test(source)) return 'image';
    if (videoRegex.test(source)) return 'video';
  };

  const handleSet = () => {
    const type = determineTypeFromSrc(src);
    console.log(src, type);

    if (!type) {
      console.log('Media type unsupported');
      return;
    }

    setMedia({ type, src, alt });
    setSrc('');
  };

  return (
    <div className="flex w-full md:w-4/5 justify-center items-center mx-auto">
      <div className="flex w-full">
        <div className="flex w-full flex-col gap-2">
          <input
            className="appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="media_url"
            type="url"
            value={src}
            // @ts-ignore
            onInput={(e) => setSrc(e.target.value)}
            placeholder={'Enter media link'}
          />
          <input
            className="appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="alt"
            type="text"
            value={alt}
            // @ts-ignore
            onInput={(e) => setAlt(e.target.value)}
            placeholder={'Enter alt text'}
          />
          <button
            onClick={() => handleSet()}
            className="flex-2 flex-shrink-0 bg-blue-500 hover:bg-blue-700 hover:border-blue-900 text-sm  text-white  py-2 px-6 rounded"
            type="button"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}

LinkOrUpload.defaultProps = defaultProps;
