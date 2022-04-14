import VisuallyHidden from '@reach/visually-hidden';
import { API } from 'aws-amplify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Content, DeleteSiteMutation, UpdateContentMutation } from '../../graphql/API';
import { Site } from '../../pages/home/dashboard';
import slugify from '../../utils/slugify';
import { deleteSite, updateContent, updateSite } from '../../graphql/mutations';
import { ClipLoader } from 'react-spinners';

type Props = {
  site: Site;
  setSite(site: Site): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSave(site: Site, setSite, values) {
  console.log(site.id, values);

  try {
    (await API.graphql({
      query: updateSite,
      variables: {
        input: {
          id: site.id,
          ...values,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: UpdateContentMutation; errors: any[] };

    setSite({ ...site, ...values });
  } catch (e) {
    console.error(e);
  }
}

async function onDelete(site: Site, setSite) {
  try {
    (await API.graphql({
      query: deleteSite,
      variables: {
        input: {
          id: site.id,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: DeleteSiteMutation; errors: any[] };

    setSite(null);
  } catch (e) {
    console.error(e);
  }
}

type Inputs = {
  title: string;
  description: string;
  subdomain: string;
  domain: string;
};

export default function SiteSettingsPanel(props: Props): JSX.Element {
  const { site, setSite } = props;
  const [isSaving, setIsSaving] = useState(false);

  const getDefaults = (site: Site) => {
    return {
      title: site.title,
      description: site.description,
      subdomain: site.subdomain,
      domain: site.customDomain,
    };
  };

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: getDefaults(site),
  });

  const subdomain = watch('subdomain');

  useEffect(() => {
    reset(getDefaults(site));
  }, [reset, site]);

  // Check if subdomain is available
  const isSubdomainAvailable = async (title: string) => {
    //TODO: Add subdomain check
    return true;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    await onSave(site, setSite, data);
    setIsSaving(false);
  };

  return (
    <div className="h-screen max-w-md bg-gray-100">
      <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">Site Settings</h1>
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
              })}
            />
            {errors.title && errors.title.type === 'required' && (
              <p role="alert" className="text-red-500 mt-1">
                Title is required
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
          <label htmlFor="Subdomain" className="text-gray-700">
            Subdomain
          </label>
          <div
            className={`mb-4 flex mt-1 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full text-gray-700 placeholder-gray-400 shadow-sm text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent  ${
              errors.subdomain && 'border-red-500 focus-within:ring-red-500'
            }`}
          >
            <input
              className="flex-1 py-2 px-4 border-none rounded-l-lg focus:outline-none focus:ring-0 placeholder-gray-400"
              id="subdomain"
              required
              placeholder="mscott"
            />
            <span className="flex-5 h-full py-2 px-4 text-gray-500 bg-white items-center rounded-r-lg border-l border-gray-300">
              .creatorkitchen.net
            </span>
          </div>
          <div className="mb-4">
            <label htmlFor="domain" className="text-gray-700">
              Custom Domain
            </label>
            <input
              id="domain"
              className={`mt-1 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.domain && 'border-red-500'
              }`}
              placeholder="creedthoughts.gov"
              aria-invalid={errors.domain ? 'true' : 'false'}
              {...register('domain', {
                required: false,
              })}
            />
            {errors.domain && errors.domain.type === 'required' && (
              <p role="alert" className="text-red-500 mt-1">
                Sorry, this domain is not available. Please choose another.
              </p>
            )}
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
            {/* <button onClick={() => onDelete(site.id)} type="button" className="rounded-lg p-2 hover:bg-gray-200">
              <div className="text-2xl text-red-500">
                <VisuallyHidden>Delete content</VisuallyHidden>
                <RiDeleteBinLine />
              </div>
            </button> */}
          </div>
        </div>
      </form>
    </div>
  );
}

SiteSettingsPanel.defaultProps = defaultProps;
