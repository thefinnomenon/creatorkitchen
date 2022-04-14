import VisuallyHidden from '@reach/visually-hidden';
import { API } from 'aws-amplify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Content, UpdateContentMutation } from '../../graphql/API';
import { Site } from '../../pages/home/dashboard';
import slugify from '../../utils/slugify';
import { updateContent } from '../../graphql/mutations';
import { ClipLoader } from 'react-spinners';

type Props = {
  site: Site;
  content: Content;
  onDelete(siteID: string, id: string): void;
  setSite(site: Site): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSave(site: Site, id: string, setSite, values) {
  console.log(site.id, id, values);

  const index = site.contents.findIndex((c) => c.id === id);
  if (index === -1) throw Error(`Failed to find ${id} in site contents`);

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
    updatedSite.contents[index] = { ...site.contents[index], ...values };
    setSite(updatedSite);
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

type Inputs = {
  title: string;
  description: string;
};
export default function ContentSettingsPanel(props: Props): JSX.Element {
  const { site, content, onDelete, setSite } = props;
  const [isSaving, setIsSaving] = useState(false);

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

  // Check if title unique (really if the slug it generates is unique...)
  const isUniqueTitle = (title: string) => {
    if (title === content.title) return true;
    return site.contents.findIndex((c) => c.slug === slugify(title)) === -1;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    await onSave(site, content.id, setSite, { ...data, slug: slugify(title) });
    setIsSaving(false);
  };

  return (
    <div className="h-screen max-w-md bg-gray-100">
      <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">Properties</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="m-4">
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="text-gray-700">
              Title
            </label>
            <input
              id="title"
              className={`mt-1 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title && 'border-red-500'
              }`}
              placeholder="Enter content title"
              aria-invalid={errors.title ? 'true' : 'false'}
              {...register('title', {
                required: true,
                validate: isUniqueTitle,
              })}
            />
            {errors.title && errors.title.type === 'required' && (
              <p role="alert" className="text-red-500 mt-1">
                Title is required
              </p>
            )}
            {errors.title && errors.title.type === 'isUniqueTitle' && (
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
              className="mt-1 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter content description"
              {...register('description', { required: false })}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700">URL</label>
            <p className="mt-1 text-gray-500 text-sm">{`${site.url}/${slugify(title)}`}</p>
          </div>
        </div>

        <div className="">
          <div className="flex gap-4">
            <button
              disabled={isSaving}
              type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold h-10 rounded-lg hover:bg-blue-500"
            >
              {isSaving ? <ClipLoader /> : 'SAVE'}
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
        </div>
      </form>
    </div>
  );
}

ContentSettingsPanel.defaultProps = defaultProps;
