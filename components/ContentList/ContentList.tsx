import { VscDiffAdded } from 'react-icons/vsc';
import VisuallyHidden from '@reach/visually-hidden';
import { Author, Site } from '../../pages/home/dashboard';
import { Ref } from 'react';

type Props = {
  site: Site;
  author: Author;
  IdRef: any;
  currIndex: string;
  setCurrIndex(index: string): void;
  checkIfSaved(): boolean;
  onCreate(): void;
  onSignOut(): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSelect(site: Site, id: string, IdRef, setCurrIndex, checkIfSaved) {
  if (!checkIfSaved()) return;

  if (id === 'site') {
    setCurrIndex('site');
    return;
  }

  if (id === 'author') {
    setCurrIndex('author');
    return;
  }

  const index = site.contents.findIndex((c) => c.id === id);
  if (index === -1) throw Error(`Failed to find ${id} in site contents`);

  setCurrIndex(index);
  IdRef.current = id;
}

export default function ContentList({
  site,
  author,
  IdRef,
  setCurrIndex,
  currIndex,
  checkIfSaved,
  onCreate,
  onSignOut,
}: Props): JSX.Element {
  return (
    <div className="flex-1 flex flex-col max-w-xs bg-gray-100 ">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">Content</h1>
        <button onClick={() => onCreate()} className="p-2 pt-3">
          <VisuallyHidden>Create new content</VisuallyHidden>
          <VscDiffAdded className="text-4xl text-gray-500 hover:text-blue-500" />
        </button>
      </div>
      <div>
        <button
          className={` text-gray-500 hover:text-blue-500 ${currIndex === 'author' && 'text-blue-500'}`}
          onClick={() => onSelect(site, 'author', currIndex, setCurrIndex, checkIfSaved)}
        >
          <h2 className="text-md font-semibold tracking-wide mb-4 pt-4 pl-4 ">
            <img
              src={author.avatarUrl || 'default-avatar.png'}
              className={`inline-block align-middle w-8 h-8 rounded-full mr-4`}
              alt="avatar"
            />
            {author.name}
          </h2>
        </button>
      </div>
      <div>
        <button
          className={`text-gray-500 hover:text-blue-500 ${currIndex === 'site' && 'text-blue-500'}`}
          onClick={() => onSelect(site, 'site', currIndex, setCurrIndex, checkIfSaved)}
        >
          <h2 className="text-md font-semibold tracking-wide mb-4 pt-4 pl-4 ">{site.url.split('//')[1]}</h2>
        </button>
      </div>
      <div className="flex-auto overflow-y-scroll">
        {site.contents.map((content, index) => (
          <div
            key={content.id}
            onClick={() => onSelect(site, content.id, IdRef, setCurrIndex, checkIfSaved)}
            className={`overflow-y-auto cursor-pointer p-4 hover:bg-gray-300 ${
              currIndex !== null && Number(currIndex) === index ? 'text-blue-600 bg-gray-300' : ''
            }`}
          >
            <h2 className={`text-xl`}>{!content.title ? 'Untitled' : content.title}</h2>
          </div>
        ))}
      </div>
      <div className="flex flex-shrink-0 flex-grow-0 flex-auto p-4">
        <button
          className="flex-1 flex justify-center items-center bg-blue-600 text-white font-semibold h-10 rounded-lg hover:bg-blue-500"
          onClick={() => onSignOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;
