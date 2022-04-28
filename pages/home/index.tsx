import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { getAuthor, siteByUsername } from '../../graphql/queries';
import { GetAuthorQuery, SiteByUsernameQuery } from '../../graphql/API';
import { ClipLoader } from 'react-spinners';

export default function Home() {
  const router = useRouter();

  const components = {
    // Footer() {
    //   return (
    //     <div>
    //       <p className="max-w-md mt-4 text-gray-800">
    //         Or&nbsp;
    //         <Link href={`posts/edit/${uuidv4()}`}>
    //           <a className="underline font-bold">click here</a>
    //         </Link>
    //         &nbsp;to continue as a guest.
    //       </p>
    //       <p className="max-w-md mt-2 text-gray-500">
    //         Saving and uploads will be disabled.
    //       </p>
    //     </div>
    //   );
    // },
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100">
      <Authenticator components={components}>
        {() => {
          async function getUserSites() {
            try {
              const { username } = await Auth.currentAuthenticatedUser();
              const { data } = (await API.graphql({
                query: siteByUsername,
                variables: {
                  username,
                },
              })) as { data: SiteByUsernameQuery; errors: any[] };
              const site = data.siteByUsername.items[0];

              if (site) {
                const { data } = (await API.graphql({
                  query: getAuthor,
                  variables: {
                    id: username,
                  },
                })) as { data: GetAuthorQuery; errors: any[] };
                const author = data.getAuthor;
                if (author) router.push('/dashboard');
                else router.push('/createAuthor');
              } else router.push('/createSite');
            } catch (e) {
              console.log(e);
            }
          }
          getUserSites();

          return (
            <div className="flex justify-center items-center">
              <ClipLoader />
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}
