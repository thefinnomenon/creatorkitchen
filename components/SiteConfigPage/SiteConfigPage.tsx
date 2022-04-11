import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useDebounce } from 'use-debounce';
import {
  Site,
  SiteBySubdomainQuery,
  UpdateSiteMutation,
} from '../../graphql/API';
import { updateSite } from '../../graphql/mutations';
import { siteBySubdomain } from '../../graphql/queries';

type Props = {
  url: string;
  site: Site;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

let PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
let ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function SiteConfigPage({ url, site }: Props): JSX.Element {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [title, setTitle] = useState(site.title);
  const [description, setDescription] = useState(site.description);
  const [subdomain, setSubdomain] = useState(site.subdomain);
  const [debouncedSubdomain] = useDebounce(subdomain, 1000);
  const [domain, setDomain] = useState(site.customDomain);
  const [debouncedDomain] = useDebounce(domain, 1000);
  const [isDomainVerified, setIsDomainVerified] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSubdomain() {
      if (debouncedSubdomain.length > 0) {
        try {
          const { data } = (await API.graphql({
            query: siteBySubdomain,
            variables: {
              subdomain: debouncedSubdomain,
            },
          })) as { data: SiteBySubdomainQuery; errors: any[] };

          if (
            !data.siteBySubdomain.items[0] ||
            data.siteBySubdomain.items[0].id === site.id
          )
            setError(null);
          else setError(`${debouncedSubdomain}.creatorkitchen.net`);
        } catch (e) {
          console.log(e);
        }
      }
    }
    checkSubdomain();
  }, [debouncedSubdomain]);

  async function verifyDomain(domain: string) {
    if (domain.length > 0) {
      try {
        const response = await fetch(
          `${PROTOCOL}${ROOT_DOMAIN}/api/domain/check?domain=${domain}`
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
  }

  useEffect(() => {
    verifyDomain(domain);
  }, []);

  const updateSiteRecord = async (name, subdomain, domain, description) => {
    setIsSaving(true);
    try {
      const { data } = (await API.graphql({
        query: updateSite,
        variables: {
          input: {
            id: site.id,
            title,
            description,
            subdomain,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: UpdateSiteMutation; errors: any[] };
    } catch (e) {
      console.log(e);
    }

    if (domain !== site.customDomain) {
      try {
        const response = await fetch(
          `${PROTOCOL}${ROOT_DOMAIN}/api/domain?domain=${domain}&siteId=${site.id}`,
          {
            method: 'POST',
          }
        );
        if (response.status === 200) console.log('Updated domain');
        else setError('');
        verifyDomain(domain);
      } catch (e) {
        console.error(e);
      }
    }

    setIsSaving(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          name: { value: string };
          subdomain: { value: string };
          domain: { value: string };
          description: { value: string };
        };
        const { name, subdomain, domain, description } = target;
        updateSiteRecord(
          name.value,
          subdomain.value,
          domain.value,
          description.value
        );
      }}
      className="w-full max-w-md pt-8  ml-4"
    >
      <h2 className="text-4xl mb-6">Site Settings</h2>
      <div className="grid gap-y-5 w-5/6 mx-auto">
        <div className="border border-gray-300 rounded-lg flex flex-start items-center focus-within:border-transparent focus-within:ring-blue-500 focus-within:ring-2">
          <input
            className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
            name="name"
            required
            placeholder="Site Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
            type="text"
          />
        </div>
        <div
          className={`border border-gray-300 rounded-lg flex flex-start items-center focus-within:border-transparent focus-within:ring-blue-500 focus-within:ring-2  ${
            error && 'border-red-500 focus-within:ring-red-500'
          }`}
        >
          <input
            className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
            name="subdomain"
            onChange={(e) => {
              setError(null);
              setSubdomain(e.target.value);
            }}
            required
            placeholder="Subdomain"
            value={subdomain}
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
        <div
          className={` flex flex-start items-center ${
            error && 'border-red-500 focus-within:ring-red-500'
          }`}
        >
          <input
            className={`w-full px-5 py-3 text-gray-700 bg-white placeholder-gray-400 border border-gray-300 focus:border-transparent focus:ring-blue-500 rounded-lg ${
              !isDomainVerified && 'border-red-500 focus-within:ring-red-500'
            }`}
            name="domain"
            onChange={(e) => {
              setError(null);
              setDomain(e.target.value);
            }}
            placeholder="Custom domain"
            value={domain}
            type="text"
          />
        </div>
        {!isDomainVerified && (
          <div className="px-5 text-left text-red-500">
            Failed to verify domain. <br />
            Set the following records on your DNS provider:
            <br />
            <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>@</td>
                  <td>76.76.21.21</td>
                </tr>
                <tr>
                  <td>CNAME</td>
                  <td>www</td>
                  <td>cname.vercel-dns.com</td>
                </tr>
              </tbody>
            </table>
            <br />
            or, set the nameservers for this domain: <br />
            ns1.vercel-dns.com <br />
            ns2.vercel-dns.com
          </div>
        )}
        <div className="border border-gray-300 rounded-lg flex flex-start items-top focus-within:border-transparent focus-within:ring-blue-500 focus-within:ring-2">
          <textarea
            className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
            name="description"
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            required
            rows={3}
          />
        </div>
      </div>
      <div className="flex items-center mt-10 w-full">
        <button
          type="submit"
          disabled={isSaving || error !== null}
          className={`${
            isSaving || error
              ? 'cursor-not-allowed text-gray-400 bg-gray-50'
              : 'bg-white text-gray-700 hover:text-blue-500 cursor-pointer'
          } w-full px-5 py-5 text-sm font-semibold border border-gray-300 rounded-lg focus:outline-none transition-all ease-in-out duration-300 focus:border-transparent focus:text-blue-500`}
        >
          {isSaving ? <ClipLoader /> : 'SAVE'}
        </button>
      </div>
    </form>
  );
}

SiteConfigPage.defaultProps = defaultProps;
