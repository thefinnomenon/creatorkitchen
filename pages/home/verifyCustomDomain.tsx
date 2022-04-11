import { useState } from 'react';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

let PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
let ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export default function VerifyCustomDomain(props: Props): JSX.Element {
  const [verifyingDomain, setVerifyingDomain] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { domain } = router.query;

  const verifyDomain = async () => {
    setVerifyingDomain(true);
    try {
      const response = await fetch(
        `${PROTOCOL}${ROOT_DOMAIN}/api/domain/check?domain=${domain}`
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setVerifyingDomain(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg">
        <h2 className="font-cal text-2xl mb-6">Verify Custom Domain</h2>
        <div className="grid gap-y-2 w-5/6 mx-auto">
          <input
            disabled={true}
            className={`w-full px-5 py-3  bg-white border border-gray-300 focus:outline-none text-gray-400 rounded-lg flex flex-start items-center`}
            name="customDomain"
            value={domain}
            type="text"
          />
          {error && (
            <p className="px-5 text-left text-red-500">
              <b>{error}</b> is not available. Please choose another custom
              domain.
            </p>
          )}
        </div>
        <div className="flex items-center mt-10 w-full">
          <button
            onClick={() => verifyDomain()}
            type="submit"
            disabled={verifyingDomain || error !== null}
            className={`${
              verifyingDomain || error
                ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                : 'bg-white text-gray-700 hover:text-blue-500 cursor-pointer'
            } w-full px-5 py-5 text-sm font-semibold border-t border-gray-300 rounded-br focus:outline-none transition-all ease-in-out duration-300 focus:text-blue-500`}
          >
            {verifyingDomain ? <ClipLoader /> : 'VERIFY CUSTOM DOMAIN'}
          </button>
        </div>
      </div>
    </div>
  );
}

VerifyCustomDomain.defaultProps = defaultProps;
