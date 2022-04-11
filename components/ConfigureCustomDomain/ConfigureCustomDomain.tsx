import { useRef, useState } from 'react';
import { API } from 'aws-amplify';
import { siteByCustomDomain } from '../../graphql/queries';
import { UpdateSiteMutation } from '../../graphql/API';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { updateSite } from '../../graphql/mutations';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

let PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
let ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function ConfigureCustomDomain(props: Props): JSX.Element {
  const [addingCustomDomain, setAddingCustomDomain] = useState<boolean>(false);
  const [customDomain, setCustomDomain] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const siteCustomDomainRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const { site: siteID } = router.query;

  const addCustomDomain = async (customDomain: string) => {
    try {
      //const cookies = document.cookie;
      const response = await fetch(
        `${PROTOCOL}${ROOT_DOMAIN}/api/domain?domain=${customDomain}&siteId=${siteID}`,
        {
          method: 'POST',
        }
      );
      if (response.status === 200)
        router.push(`/verifyCustomDomain?domain=${customDomain}`);
      else setError(customDomain);
    } catch (e) {
      console.error(e);
    }
    setAddingCustomDomain(false);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
          customDomain: { value: string };
        };
        const { customDomain } = target;
        setAddingCustomDomain(true);
        addCustomDomain(customDomain.value);
      }}
      className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
    >
      <h2 className="font-cal text-2xl mb-6">Add a Custom Domain</h2>
      <div className="grid gap-y-2 w-5/6 mx-auto">
        <input
          className={`w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 focus:outline-none placeholder-gray-400 rounded-lg flex flex-start items-center focus-within:border-transparent focus-within:ring-blue-500 focus-within:ring-2 
             ${error && 'border-red-500 focus-within:ring-red-500'}`}
          name="customDomain"
          onInput={() => {
            setError(null);
            setCustomDomain(siteCustomDomainRef.current!.value);
          }}
          required
          placeholder="creedthoughts.gov"
          ref={siteCustomDomainRef}
          type="text"
        />
        <p className="text-sm text-gray-500 text-right">
          Automatically adds www redirect
        </p>
        {error && (
          <p className="px-5 text-left text-red-500">
            <b>{error}</b> is not available. Please choose another custom
            domain.
          </p>
        )}
      </div>
      <div className="flex items-center mt-10 w-full">
        <button
          type="submit"
          disabled={addingCustomDomain || error !== null}
          className={`${
            addingCustomDomain || error
              ? 'cursor-not-allowed text-gray-400 bg-gray-50'
              : 'bg-white text-gray-700 hover:text-blue-500 cursor-pointer'
          } w-full px-5 py-5 text-sm font-semibold border-t border-gray-300 rounded-br focus:outline-none transition-all ease-in-out duration-300 focus:text-blue-500`}
        >
          {addingCustomDomain ? <ClipLoader /> : 'ADD CUSTOM DOMAIN'}
        </button>
      </div>
    </form>
  );
}

ConfigureCustomDomain.defaultProps = defaultProps;
