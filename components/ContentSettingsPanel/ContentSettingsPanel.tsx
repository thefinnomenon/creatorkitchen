import VisuallyHidden from '@reach/visually-hidden';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

type Props = {
  post: any;
  onUpdate(values: any): void;
  setIsSaved(value: boolean): void;
  onDelete(id: string): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ContentList({
  post,
  onUpdate,
  setIsSaved,
  onDelete,
}: Props): JSX.Element {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || '');

  useEffect(() => {
    setTitle(post.title);
    setDescription(post.description);
  }, [post]);

  return (
    <div className="h-full max-w-md bg-gray-100">
      <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">
        Properties
      </h1>
      <div className="p-2">
        <div className="relative">
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
            placeholder="Enter content description"
            name="description"
            rows={5}
            cols={40}
          ></textarea>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className="fixed bottom-1 right-2 rounded-lg p-2 hover:bg-gray-200"
        >
          <div className=" flex items-center text-2xl text-red-500">
            <VisuallyHidden>Delete content</VisuallyHidden>
            <RiDeleteBinLine />
          </div>
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;
