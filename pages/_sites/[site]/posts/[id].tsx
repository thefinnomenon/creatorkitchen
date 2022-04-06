import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { getContent, siteByDomain } from '../../../../graphql/queries';
import {
  ListSitesWithContentQuery,
  ListSitesWithContents,
} from '../../../../graphql/customStatements';
import Amplify from 'aws-amplify';
import config from '../../../../aws-exports';
Amplify.configure(config);
import Script from 'next/script';
import 'tippy.js/dist/svg-arrow.css';
import { GetContentQuery, SiteByDomainQuery } from '../../../../graphql/API';

type PostType = {
  id: string;
  subdomain: string;
  content: string;
};

type Props = {
  post: PostType;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Post({ post }: Props) {
  const router = useRouter();
  const { id } = router.query;

  if (!post.content) return null;

  return (
    <>
      <Script
        src="https://unpkg.com/@popperjs/core@2"
        strategy="beforeInteractive"
      />
      <Script src="https://unpkg.com/tippy.js@6" strategy="beforeInteractive" />
      <Script id="initialize-tooltips" strategy="afterInteractive">
        {`tippy('[data-tooltip-content]', { interactive: true, allowHTML: true, arrow: tippy.roundArrow, theme: 'my-tippy', onShow(instance) {
        instance.popper.hidden = instance.reference.dataset.tooltipContent ? false : true;
      	instance.setContent(instance.reference.dataset.tooltipContent);
      } })`}
      </Script>
      <div className="w-full min-h-screen bg-white flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white">
          <div
            className="ProseMirror p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </>
  );
}

// At build time, resolve domain to site and get content for siteID, id combo
export async function getStaticProps({ params }) {
  const { site, id } = params;

  try {
    const siteRes = (await API.graphql({
      query: siteByDomain,
      variables: {
        domain: site,
      },
    })) as { data: SiteByDomainQuery; errors: any[] };
    if (!siteRes.data.siteByDomain.items[0]) return { notFound: true };

    const contentRes = (await API.graphql({
      query: getContent,
      variables: {
        id,
        siteID: siteRes.data.siteByDomain.items[0].id,
      },
    })) as { data: GetContentQuery; errors: any[] };
    if (!contentRes.data.getContent) return { notFound: true };

    return {
      props: {
        post: contentRes.data.getContent,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

// At build time, get all sites and their content and get content and return them as site, id combos
export async function getStaticPaths() {
  try {
    const sitesRes = (await API.graphql({
      query: ListSitesWithContents,
    })) as { data: ListSitesWithContentQuery; errors: any[] };

    const paths = sitesRes.data.listSites.items.reduce((arr, site) => {
      site.contents.items.forEach((content) => {
        arr.push({
          params: { site: site.domain, id: content.id },
        });
      });
      return arr;
    }, []);

    console.log(paths);

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.log(error);
  }
}
