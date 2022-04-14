import { VscDiffAdded } from 'react-icons/vsc';
import VisuallyHidden from '@reach/visually-hidden';
import { Site } from '../../pages/home/dashboard';
import { Content } from '../../graphql/API';

type Props = {
  site: Site;
  selectedId: string;
  setContent(content: Content): void;
  checkIfSaved(): boolean;
  onCreate(): void;
  onSignOut(): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSelect(site: Site, id: string, setContent, checkIfSaved) {
  //if (!checkIfSaved()) return;

  if (id === 'site') {
    setContent({ id: 'site' });
    return;
  }

  const index = site.contents.findIndex((c) => c.id === id);
  if (index === -1) throw Error(`Failed to find ${id} in site contents`);

  setContent(site.contents[index]);
}

export default function ContentList({
  site,
  selectedId,
  setContent,
  checkIfSaved,
  onCreate,
  onSignOut,
}: Props): JSX.Element {
  return (
    <div className="max-w-md bg-gray-100">
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">Content</h1>
            <button onClick={() => onCreate()} className="p-2 pt-3">
              <VisuallyHidden>Create new content</VisuallyHidden>
              <VscDiffAdded className="text-4xl text-gray-500 hover:text-blue-500" />
            </button>
          </div>
          <div>
            <button
              className={`text-gray-500 hover:text-blue-500 ${selectedId === 'site' && 'text-blue-500'}`}
              onClick={() => onSelect(site, 'site', setContent, checkIfSaved)}
            >
              <h2 className="text-md font-semibold tracking-wide mb-4 pt-4 pl-4 ">{site.url.split('//')[1]}</h2>
            </button>
          </div>
          {site.contents.map((content) => (
            <div
              key={content.id}
              onClick={() => onSelect(site, content.id, setContent, checkIfSaved)}
              className={`overflow-y-auto cursor-pointer p-4 hover:bg-gray-300 ${
                content.id === selectedId ? 'text-blue-600 bg-gray-300' : ''
              }`}
            >
              <h2 className={`text-xl`}>
                {/* {!content.title ? 'Untitled' : content.title} */}
                {!content.title ? content.updatedAt : content.title}
              </h2>
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
