import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const components = {
    Footer() {
      return (
        <div>
          <p className="max-w-md mt-4 text-gray-800">
            Or&nbsp;
            <Link href={`posts/edit/${uuidv4()}`}>
              <a className="underline font-bold">click here</a>
            </Link>
            &nbsp;to continue as a guest.
          </p>
          <p className="max-w-md mt-2 text-gray-500">
            Saving and uploads will be disabled.
          </p>
        </div>
      );
    },
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100">
      <Authenticator components={components}>
        {({ signOut, user }) => {
          router.push(`posts/edit/${uuidv4()}`);

          return (
            <div className="flex flex-col">
              <h1 className="text-3xl">Welcome Back!</h1>
              <p className="text-lg mt-2">Redirecting you to a fresh editor</p>
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}
