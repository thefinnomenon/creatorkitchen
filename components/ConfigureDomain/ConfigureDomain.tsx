import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { API } from 'aws-amplify';
import { siteByDomain } from '../../graphql/queries';
import { CreateSiteMutation, SiteByDomainQuery } from '../../graphql/API';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { createSite } from '../../graphql/mutations';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ConfigureDomain(props: Props): JSX.Element {
  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [subdomain, setSubdomain] = useState<string>('');
  const [debouncedSubdomain] = useDebounce(subdomain, 1500);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const siteNameRef = useRef<HTMLInputElement | null>(null);
  const siteSubdomainRef = useRef<HTMLInputElement | null>(null);
  const siteDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

  // Check if subdomain is available
  useEffect(() => {
    async function checkSubDomain() {
      if (debouncedSubdomain.length > 0) {
        try {
          console.log(`Checking if ${debouncedSubdomain} is available`);
          const siteRes = (await API.graphql({
            query: siteByDomain,
            variables: {
              domain: debouncedSubdomain,
            },
          })) as { data: SiteByDomainQuery; errors: any[] };

          if (!siteRes.data.siteByDomain.items[0]) {
            setIsValid(true);
            setError(null);
          } else {
            setIsValid(false);
            setError(`${debouncedSubdomain}.creatorkitchen.net`);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    checkSubDomain();
  }, [debouncedSubdomain]);

  const router = useRouter();

  async function createNewSite(e: React.SyntheticEvent) {
    const target = e.target as typeof e.target & {
      name: { value: string };
      subdomain: { value: string };
      description: { value: string };
    };
    const { name, subdomain, description } = target;
    console.log(`${name.value}, ${subdomain.value}, ${description.value}`);

    try {
      const createSiteResult = (await API.graphql({
        query: createSite,
        variables: {
          input: {
            title: name.value,
            description: description.value,
            domain: subdomain.value,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: CreateSiteMutation; errors: any[] };

      router.push(`/dashboard?site=${createSiteResult.data.createSite.id}`);
    } catch (e) {
      console.log(e);
    }
    setCreatingSite(false);
  }

  function resetValidation() {
    setError('');
    setIsValid(false);
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setCreatingSite(true);
          createNewSite(event);
        }}
        className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
      >
        <h2 className="font-cal text-2xl mb-6">Create a New Site</h2>
        <div className="grid gap-y-5 w-5/6 mx-auto">
          <div className="border border-gray-300 rounded-lg flex flex-start items-center focus-within:ring-blue-500 focus-within:ring-2">
            <span className="pl-5 pr-1">📌</span>
            <input
              className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
              name="name"
              required
              placeholder="Site Name"
              ref={siteNameRef}
              type="text"
            />
          </div>
          <div
            className={`border border-gray-300 rounded-lg flex flex-start items-center focus-within:ring-blue-500 focus-within:ring-2 ${
              isValid && 'border-green-500 focus-within:ring-green-500'
            } ${error && 'border-red-500 focus-within:ring-red-500'}`}
          >
            <span className="pl-5 pr-1">🪧</span>
            <input
              className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
              name="subdomain"
              onInput={() => {
                resetValidation();
                setSubdomain(siteSubdomainRef.current!.value);
              }}
              required
              placeholder="Subdomain"
              ref={siteSubdomainRef}
              type="text"
            />
            <span className="px-5 bg-gray-100 h-full flex items-center rounded-r-lg border-l border-gray-600">
              .creatorkitchen.net
            </span>
          </div>
          {error && (
            <p className="px-5 text-left text-red-500">
              <b>{error}</b> is not available. Please choose another subdomain.
            </p>
          )}
          <div className="border border-gray-300 rounded-lg flex flex-start items-top focus-within:ring-blue-500 focus-within:ring-2">
            <span className="pl-5 pr-1 mt-3">✍️</span>
            <textarea
              className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
              name="description"
              placeholder="Description"
              ref={siteDescriptionRef}
              required
              rows={3}
            />
          </div>
        </div>
        <div className="flex items-center mt-10 w-full">
          <button
            type="submit"
            disabled={creatingSite || error !== null}
            className={`${
              creatingSite || error
                ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                : 'bg-white text-gray-700 hover:text-blue-500'
            } w-full px-5 py-5 text-sm font-semibold border-t border-gray-300 rounded-br focus:outline-none transition-all ease-in-out duration-500 focus:text-blue-500`}
          >
            {creatingSite ? <ClipLoader /> : 'CREATE SITE'}
          </button>
        </div>
      </form>
    </>
  );
}

ConfigureDomain.defaultProps = defaultProps;
