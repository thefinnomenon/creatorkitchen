import VisuallyHidden from '@reach/visually-hidden';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { ContentBySiteAndSlugQuery } from '../../graphql/API';
import { contentBySiteAndSlug } from '../../graphql/queries';
import slugify from '../../utils/slugify';

type Props = {
  siteID: string;
  url: string;
  post: any;
  onUpdate(values: any): void;
  setIsSaved(value: boolean): void;
  onDelete(id: string): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

// Placeholder slug is a UUID
const isPlaceholderSlug = (str: string) => {
  // Regular expression to check if string is a valid UUID
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};
export default function ContentList({
  siteID,
  url,
  post,
  onUpdate,
  setIsSaved,
  onDelete,
}: Props): JSX.Element {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || '');
  const [slug, setSlug] = useState(post.slug || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(post.title);
    setDescription(post.description);
    setSlug(isPlaceholderSlug(post.slug) ? '' : post.slug);
  }, [post]);

  // Check if slug changed and is available and if so, update
  async function updateSlug(newSlug: string) {
    try {
      const { data } = (await API.graphql({
        query: contentBySiteAndSlug,
        variables: {
          siteID,
          slug: newSlug,
        },
      })) as { data: ContentBySiteAndSlugQuery; errors: any[] };

      if (!data.contentBySiteAndSlug.items[0]) {
        onUpdate({ slug: newSlug });
      } else {
        if (data.contentBySiteAndSlug.items[0].id === post.id) {
          setIsSaved(true);
          return;
        }
        setError(`${url}/${newSlug}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="h-screen max-w-md bg-gray-100">
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">
            Properties
          </h1>
          <div className="p-2">
            <div className="relative mb-2">
              <label htmlFor="title" className="text-gray-700">
                Title
              </label>
              <input
                onBlur={(e) => onUpdate({ title: e.target.value })}
                onChange={(e) => {
                  setIsSaved(false);
                  setTitle(e.target.value);
                }}
                value={title}
                type="text"
                id="title"
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="title"
                placeholder="Enter content title"
              />
            </div>
            <div className="relative">
              <label htmlFor="description" className="text-gray-700">
                Description
              </label>
              <textarea
                onBlur={(e) => onUpdate({ description: e.target.value })}
                onChange={(e) => {
                  setIsSaved(false);
                  setDescription(e.target.value);
                }}
                value={description}
                className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="description"
                name="description"
                placeholder="Enter content description"
                rows={5}
                cols={40}
              ></textarea>
            </div>
            <div className="relative">
              <label htmlFor="url" className="text-gray-700">
                URL
              </label>
              <input
                onBlur={(e) => updateSlug(e.target.value)}
                onChange={(e) => {
                  setError('');
                  setIsSaved(false);
                  setSlug(slugify(e.target.value));
                }}
                value={slug}
                type="text"
                id="url"
                className={`rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error && 'border-red-500 focus:ring-red-500'
                }`}
                name="url"
                placeholder={slug || slugify(title)}
              />
              <span className="text-gray-500 text-sm">{`${url}/${
                slug || slugify(title)
              }`}</span>
            </div>
            {error && (
              <p className="text-red-500">
                <b>{error}</b> is not available. Please choose another URL.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className="flex self-end rounded-lg p-2 hover:bg-gray-200 m-1"
        >
          <div className="text-2xl text-red-500">
            <VisuallyHidden>Delete content</VisuallyHidden>
            <RiDeleteBinLine />
          </div>
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;
