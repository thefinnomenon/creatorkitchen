import { VscDiffAdded } from 'react-icons/vsc';
import VisuallyHidden from '@reach/visually-hidden';

type Props = {
  content: any;
  selectedId: string;
  onSelect(id: string): void;
  onCreate(): void;
  onSignOut(): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ContentList({
  content,
  selectedId,
  onSelect,
  onCreate,
  onSignOut,
}: Props): JSX.Element {
  return (
    <div className="h-full max-w-md bg-gray-100">
      <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">
        Properties
      </h1>
      {content.map((post, index) => (
        <div
          key={index}
          onClick={() => onSelect(post.id)}
          className={`overflow-y-auto cursor-pointer p-4 hover:bg-gray-300 ${
            post.id === selectedId ? 'font-bold text-blue-600 bg-gray-300' : ''
          }`}
        >
          <h2
            className={`text-xl ${
              post.id === selectedId ? 'font-bold' : 'font-medium'
            }`}
          >
            {post.title}
          </h2>
          {/* <p className="text-gray-500 mt-2 mb-2">Author: {post.username}</p> */}
        </div>
      ))}
      <div className="fixed bottom-2 left-2">
        <button
          className="ml-auto mr-0 bg-blue-600 text-white font-semibold px-8 rounded-lg w-40 h-8"
          onClick={() => onSignOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;