import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { siteByCustomDomain, contentBySiteAndSlug, siteBySubdomain } from '../../../../graphql/queries';
import Amplify from 'aws-amplify';
import config from '../../../../aws-exports';
Amplify.configure(config);
import Script from 'next/script';
import 'tippy.js/dist/svg-arrow.css';
import { SiteByCustomDomainQuery, ContentBySiteAndSlugQuery, SiteBySubdomainQuery } from '../../../../graphql/API';

type PostType = {
  id: string;
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
      <Script src="https://unpkg.com/@popperjs/core@2" strategy="beforeInteractive" />
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

// @site: the domain or subdomain (e.g. mysite)
// @slug: the slug for the content (e.g. my-first-post)
// - Retrieves site record by querying siteByDomain index with @site
// - Retrieves content by querying contentBySiteAndSlug with site ID and @slug
export async function getServerSideProps({ params: { site, slug } }) {
  const isCustomDomain = site.includes('.');
  console.log(site, slug, isCustomDomain);
  try {
    let siteObj;
    if (isCustomDomain) {
      const siteRes = (await API.graphql({
        query: siteByCustomDomain,
        variables: {
          customDomain: site,
        },
      })) as { data: SiteByCustomDomainQuery; errors: any[] };
      if (!siteRes.data.siteByCustomDomain.items[0]) return { notFound: true };
      siteObj = siteRes.data.siteByCustomDomain.items[0];
    } else {
      const siteRes = (await API.graphql({
        query: siteBySubdomain,
        variables: {
          subdomain: site,
        },
      })) as { data: SiteBySubdomainQuery; errors: any[] };
      if (!siteRes.data.siteBySubdomain.items[0]) return { notFound: true };
      siteObj = siteRes.data.siteBySubdomain.items[0];
    }
    console.log(site);
    const { data } = (await API.graphql({
      query: contentBySiteAndSlug,
      variables: {
        siteID: { eq: siteObj.id },
        slug,
      },
    })) as { data: ContentBySiteAndSlugQuery; errors: any[] };
    if (!data.contentBySiteAndSlug.items[0]) return { notFound: true };
    console.log(data.contentBySiteAndSlug.items[0]);

    return {
      props: {
        post: data.contentBySiteAndSlug.items[0],
      },
    };
  } catch (error) {
    console.log(error);
  }
}
