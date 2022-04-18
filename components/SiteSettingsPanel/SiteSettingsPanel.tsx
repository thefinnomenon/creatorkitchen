import { API } from 'aws-amplify';
import debouncePromise from 'awesome-debounce-promise';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SiteBySubdomainQuery, UpdateContentMutation } from '../../graphql/API';
import { Site, getSiteUrl } from '../../pages/home/dashboard';
import { updateSite } from '../../graphql/mutations';
import { ClipLoader } from 'react-spinners';
import { inputStyle } from '../ContentSettingsPanel/ContentSettingsPanel';
import { siteBySubdomain } from '../../graphql/queries';

type Props = {
  site: Site;
  setSite(site: Site): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

async function onSave(site: Site, setSite, values) {
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

    const url = getSiteUrl({ customDomain: site.customDomain, subdomain: site.subdomain, ...values });
    setSite({ ...site, ...values, url });
  } catch (e) {
    console.error(e);
  }
}

const isSubdomainAvailable = async (subdomain: string, currentSubdomain: string) => {
  if (subdomain.length === 0) return false;
  if (subdomain === currentSubdomain) return true;

  try {
    const { data } = (await API.graphql({
      query: siteBySubdomain,
      variables: {
        subdomain: subdomain,
      },
    })) as { data: SiteBySubdomainQuery; errors: any[] };
    if (data.siteBySubdomain.items.length === 0) return true;
    else return false;
  } catch (e) {
    console.log(e);
  }
};

const verifyDomain = async (domain: string, setIsDomainVerified) => {
  if (domain.length > 0) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}/api/domain/check?domain=${domain}`
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (data) setIsDomainVerified(true);
      else setIsDomainVerified(false);
    } catch (e) {
      setIsDomainVerified(false);
      console.error(e);
    }
  }
};

type Inputs = {
  title: string;
  description: string;
  subdomain: string;
  //domain: string;
};

export default function SiteSettingsPanel(props: Props): JSX.Element {
  const { site, setSite } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [isDomainVerified, setIsDomainVerified] = useState(true);

  const debouncedIsSubdomainAvailable = useMemo(
    () => debouncePromise((value) => isSubdomainAvailable(value, site.subdomain), 200),
    [site.subdomain]
  );

  const getDefaults = (site: Site) => {
    return {
      title: site.title,
      description: site.description,
      subdomain: site.subdomain,
      //domain: site.customDomain,
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

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    setIsSaving(true);
    await onSave(site, setSite, data);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col max-w-xs bg-gray-100" autoComplete="off">
      <h1 className="text-3xl font-semibold tracking-wide p-4">Site Settings</h1>
      <div className="flex-auto overflow-y-scroll p-4">
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-700">
            Title
          </label>
          <input
            id="title"
            className={inputStyle(errors.title)}
            placeholder="Enter site title"
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
            className={`${inputStyle(errors.description)} align-top`}
            placeholder="Enter site description"
            {...register('description', { required: false })}
          />
        </div>
        <label htmlFor="Subdomain" className="text-gray-700 mt-0">
          Subdomain
        </label>
        <div className="mb-4 mt-1">
          <div
            className={`flex rounded-lg flex-1 appearance-none border-gray-300 w-full text-gray-700 placeholder-gray-400 shadow-sm text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent  ${
              errors.subdomain && 'border border-red-500 focus-within:ring-red-500'
            }`}
          >
            <input
              className="w-full py-2 px-4 flex-shrink flex-grow flex-1 leading-normal border border-none rounded-l-lg focus:outline-none focus:ring-0 placeholder-gray-400"
              id="subdomain"
              spellCheck={false}
              placeholder="mscott"
              aria-invalid={errors.subdomain ? 'true' : 'false'}
              {...register('subdomain', {
                required: true,
                validate: debouncedIsSubdomainAvailable,
              })}
            />
            <span className="flex leading-normal border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm text-gray-500 bg-white items-center rounded-r-lg border-l border-gray-300">
              .{process.env.NEXT_PUBLIC_DOMAIN}
            </span>
          </div>
          {errors.subdomain && errors.subdomain.type === 'required' && (
            <p role="alert" className="text-red-500 mt-1">
              Subdomain is required
            </p>
          )}
          {errors.subdomain && errors.subdomain.type === 'validate' && (
            <p role="alert" className="text-red-500 mt-1">
              {subdomain}.{process.env.NEXT_PUBLIC_DOMAIN} is not available.
            </p>
          )}
        </div>
        {/* <div className="mb-4">
            <label htmlFor="domain" className="text-gray-700">
              Custom Domain
            </label>
            <input
              id="domain"
              spellCheck={false}
              className={inputStyle(errors.domain)}
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
          </div> */}
      </div>

      <div className="flex flex-shrink-0 flex-grow-0 flex-auto p-4">
        <button
          disabled={isSaving}
          type="submit"
          className="flex-1 flex justify-center items-center bg-blue-600 text-white font-semibold h-10 rounded-lg hover:bg-blue-500"
        >
          {isSaving ? <ClipLoader color="white" size={'1.5rem'} /> : 'SAVE'}
        </button>
      </div>
    </form>
  );
}

SiteSettingsPanel.defaultProps = defaultProps;
