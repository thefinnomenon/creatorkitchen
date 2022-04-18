import VisuallyHidden from '@reach/visually-hidden';
import debouncePromise from 'awesome-debounce-promise';
import { API } from 'aws-amplify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Content, UpdateContentMutation } from '../../graphql/API';
import { Site } from '../../pages/home/dashboard';
import slugify from '../../utils/slugify';
import { updateContent } from '../../graphql/mutations';
import { ClipLoader } from 'react-spinners';

type Props = {
  site: Site;
  currIndex: string;
  onDelete(siteID: string, id: string): void;
  setSite(site: Site): void;
  setCurrIndex(index: string): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSave(site: Site, id: string, currIndex, setSite, setCurrIndex, values) {
  try {
    (await API.graphql({
      query: updateContent,
      variables: {
        input: {
          id,
          siteID: site.id,
          ...values,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: UpdateContentMutation; errors: any[] };

    const updatedSite = { ...site };
    updatedSite.contents[currIndex] = { ...site.contents[currIndex], ...values };
    // If title changed we need to re-sort the content list and update the currIndex
    if ('title' in values) {
      updatedSite.contents.sort((a, b) => (a.title > b.title ? 1 : -1));
      const index = site.contents.findIndex((c) => c.id === id);
      setSite(updatedSite);
      setCurrIndex(index);
    } else {
      setSite(updatedSite);
    }
  } catch (e) {
    console.error(e);
  }
}

// Placeholder slug is a UUID
const isPlaceholderSlug = (str: string) => {
  // Regular expression to check if string is a valid UUID
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};

// Check if title unique (really if the slug it generates is unique...)
const isUniqueTitle = (site, title: string, currentTitle: string) => {
  if (title === currentTitle) return true;
  return site.contents.findIndex((c) => c.slug === slugify(title)) === -1;
};

export const inputStyle = (error) =>
  `mt-1 rounded-lg appearance-none w-full py-2 px-4 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error && 'border border-red-500 focus:ring-red-500'
  }`;

type Inputs = {
  title: string;
  description: string;
};
export default function ContentSettingsPanel(props: Props): JSX.Element {
  const { site, currIndex, onDelete, setSite, setCurrIndex } = props;
  const [isSaving, setIsSaving] = useState(false);
  const content = site.contents[currIndex];

  const debouncedIsUniqueTitle = useMemo(
    () => debouncePromise((value) => isUniqueTitle(site, value, content.title), 200),
    [site, content.title]
  );

  const getDefaults = (content: Content) => {
    return {
      title: content.title,
      description: content.description,
    };
  };

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: getDefaults(content),
  });
  const title = watch('title');

  useEffect(() => {
    reset(getDefaults(content));
  }, [reset, content]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    await onSave(site, content.id, currIndex, setSite, setCurrIndex, { ...data, slug: slugify(title) });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col max-w-xs bg-gray-100" autoComplete="off">
      <h1 className="text-3xl font-semibold tracking-wide p-4">Content Settings</h1>
      <div className="flex-auto overflow-y-scroll p-4">
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-700">
            Title
          </label>
          <input
            id="title"
            className={inputStyle(errors.title)}
            placeholder="Enter content title"
            aria-invalid={errors.title ? 'true' : 'false'}
            {...register('title', {
              required: true,
              validate: debouncedIsUniqueTitle,
            })}
          />
          {errors.title && errors.title.type === 'required' && (
            <p role="alert" className="text-red-500 mt-1">
              Title is required
            </p>
          )}
          {errors.title && errors.title.type === 'validate' && (
            <p role="alert" className="text-red-500 mt-1">
              Title must be unique. Please choose another one.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            className={`${inputStyle(errors.description)} align-top`}
            placeholder="Enter content description"
            {...register('description', { required: false })}
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700">URL</label>
          <p className="mt-1 text-gray-500 text-sm">{`${site.url}/${slugify(title)}`}</p>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-grow-0 flex-auto gap-4 p-4">
        <button
          disabled={isSaving}
          type="submit"
          className="flex-1 flex justify-center items-center bg-blue-600 text-white font-semibold h-10 rounded-lg hover:bg-blue-500"
        >
          {isSaving ? <ClipLoader color="white" size={'1.5rem'} /> : 'SAVE'}
        </button>
        <button
          onClick={() => onDelete(site.id, content.id)}
          type="button"
          className="rounded-lg p-2 hover:bg-gray-200"
        >
          <div className="text-2xl text-red-500">
            <VisuallyHidden>Delete content</VisuallyHidden>
            <RiDeleteBinLine />
          </div>
        </button>
      </div>
    </form>
  );
}

ContentSettingsPanel.defaultProps = defaultProps;
