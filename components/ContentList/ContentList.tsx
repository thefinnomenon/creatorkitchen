import { VscDiffAdded } from 'react-icons/vsc';
import VisuallyHidden from '@reach/visually-hidden';
import { Content } from '../../graphql/API';

type Props = {
  url: string;
  contents: Content[];
  selectedId: string;
  onSelect(id: string): void;
  onCreate(): void;
  onSignOut(): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ContentList({
  url,
  contents,
  selectedId,
  onSelect,
  onCreate,
  onSignOut,
}: Props): JSX.Element {
  return (
    <div className="max-w-md bg-gray-100">
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">
              Content
            </h1>
            <button onClick={() => onCreate()} className="p-2 pt-3">
              <VisuallyHidden>Create new content</VisuallyHidden>
              <VscDiffAdded className="text-4xl text-gray-500 hover:text-blue-500" />
            </button>
          </div>
          <div>
            <button
              className="text-gray-500 hover:text-blue-500"
              onClick={() => onSelect('site')}
            >
              <h2 className="text-md font-semibold tracking-wide mb-4 pt-4 pl-4 ">
                {url.split('//')[1]}
              </h2>
            </button>
          </div>
          {contents.map((content, index) => (
            <div
              key={index}
              onClick={() => onSelect(content.id)}
              className={`overflow-y-auto cursor-pointer p-4 hover:bg-gray-300 ${
                content.id === selectedId
                  ? 'font-bold text-blue-600 bg-gray-300'
                  : ''
              }`}
            >
              <h2
                className={`text-xl ${
                  content.id === selectedId ? 'font-bold' : 'font-medium'
                }`}
              >
                {content.title === '' ? 'Untitled' : content.title}
              </h2>
              {/* <p className="text-gray-500 mt-2 mb-2">Author: {post.username}</p> */}
            </div>
          ))}
        </div>
        <button
          className="bg-blue-600 text-white font-semibold px-8 rounded-lg h-8 m-2 hover:bg-blue-500"
          onClick={() => onSignOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;
