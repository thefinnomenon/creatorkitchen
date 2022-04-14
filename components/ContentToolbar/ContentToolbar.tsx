import VisuallyHidden from '@reach/visually-hidden';
import { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';

type Props = {
  isSaved: boolean;
  url: string;
  slug: string;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ContentToolbar({ isSaved, url, slug }: Props): JSX.Element {
  const [isPublishing, setIsPublishing] = useState(false);
  return (
    <div className="flex items-center justify-between px-4 pb-2">
      {isSaved ? <p className="text-gray-400">Saved</p> : <div />}
      <div className="flex items-stretch">
        <a
          className="text-blue-600 font-semibold rounded-lg p-2 hover:bg-gray-200"
          target="_blank"
          rel="noopener noreferrer"
          href={`${url}/preview/${slug}`}
          onClick={(e) => {
            if (!isSaved) {
              const cont = alert("Current draft isn't saved. Please wait a few seconds.");
              e.preventDefault();
              return false;
            }
          }}
        >
          Preview
        </a>

        <button
          className="bg-blue-600 font-semibold text-white rounded-lg p-2 hover:bg-blue-500 mx-2"
          onClick={async (e) => {
            if (!isSaved) {
              const cont = alert("Current draft isn't saved. Please wait a few seconds.");
              return false;
            }
            setIsPublishing(true);
            try {
              const cookies = document.cookie;
              const response = await fetch(`${url}/api/publish?slug=${slug}`, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(cookies),
              });
            } catch (e) {
              console.error(e);
            }
            setIsPublishing(false);
          }}
        >
          {isPublishing ? <ClipLoader color="white" size={24} /> : 'Publish'}
        </button>
        <a target="_blank" rel="noopener noreferrer" href={`${url}/posts/${slug}`}>
          <button>
            <VisuallyHidden>View published content</VisuallyHidden>
            <FiExternalLink className="font-semibold text-4xl text-blue-600 rounded-lg p-2 hover:bg-gray-200" />
          </button>
        </a>
      </div>
    </div>
  );
}

ContentToolbar.defaultProps = defaultProps;
