import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import {
  contentBySiteAndSlug,
  getContent,
  siteBySubdomain,
  siteByCustomDomain,
  getSite,
  contentByParentID,
} from '../../../../graphql/queries';
import {
  contentAndPublishedBySiteAndSlug,
  ContentAndPublishedBySiteAndSlugQuery,
  ListSitesWithContentQuery,
  ListSitesWithContents,
} from '../../../../graphql/customStatements';
import Amplify from 'aws-amplify';
import config from '../../../../aws-exports';
Amplify.configure(config);
import Script from 'next/script';
import 'tippy.js/dist/svg-arrow.css';
import {
  ContentBySiteAndSlugQuery,
  GetContentQuery,
  SiteBySubdomainQuery,
  SiteByCustomDomainQuery,
  GetSiteQuery,
  ContentStatus,
  ContentByParentIDQuery,
  Content,
} from '../../../../graphql/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Author } from '../../../home/dashboard';
import NavBar from '../../../../components/NavBar';

type Props = {
  post: Content;
  author: Author;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Post({ post, author }: Props) {
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
      <NavBar />
      <div className="w-full min-h-screen bg-white flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-2xl min-w-0 bg-white">
          {/* <div className="flex flex-col justify-center items-center mt-10 mb-8">
            <h1 className="text-7xl mb-2">{post.title}</h1>
            <p>{new Date(post.originalCreatedAt).toLocaleDateString()}</p>
          </div> */}
          <div
            className="ProseMirror p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="flex flex-col justify-center items-center mt-10 mb-8">
            <p>Last Updated: {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-black h-[2px] w-6/12 opacity-30 my-10 mx-auto" />
          <div className="flex flex-col justify-center items-center mt-8 gap-4">
            <img
              src={post.author.avatarUrl || 'default-avatar.png'}
              className={`w-32 h-32 rounded-full`}
              alt="avatar"
            />
            <p>{author.bio}</p>
            <div className="flex gap-8 mb-10">
              <a href={`mailto:${author.links.email}`} target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon size={'2x'} icon={faEnvelope} className="opacity-70 hover:opacity-100" />
              </a>
              <a href={`https://twitter.com/${author.links.twitter}`} target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon size={'2x'} icon={faTwitter} className="opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// At build time, resolve domain to site and get content for siteID, slug combo
export async function getStaticProps({ params: { site, slug } }) {
  //console.log('GET STATIC PROPS');
  const isCustomDomain = site.includes('.');
  //console.log(site, slug, isCustomDomain);
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
    //console.log(site);
    const draftRes = (await API.graphql({
      query: contentAndPublishedBySiteAndSlug,
      variables: {
        siteID: { eq: siteObj.id },
        slug,
      },
    })) as { data: ContentAndPublishedBySiteAndSlugQuery; errors: any[] };
    if (!draftRes.data.contentBySiteAndSlug.items[0]) return { notFound: true };

    //console.log('DRAFT, ', draftRes.data.contentBySiteAndSlug.items[0]);

    const { data } = (await API.graphql({
      query: contentByParentID,
      variables: {
        siteID: { eq: siteObj.id },
        parentID: draftRes.data.contentBySiteAndSlug.items[0].id,
      },
    })) as { data: ContentByParentIDQuery; errors: any[] };
    if (!data.contentByParentID.items[0]) return { notFound: true };

    //console.log(data.contentByParentID.items);

    data.contentByParentID.items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

    // JSON parse author links
    const author = data.contentByParentID.items[0].author;
    author.links = JSON.parse(author.links);

    return {
      props: {
        post: data.contentByParentID.items[0],
        author,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

// At build time, get all sites and their content and get content and return them as site, slug combos
export async function getStaticPaths() {
  //console.log('GET STATIC PATHS');
  try {
    const sitesRes = (await API.graphql({
      query: ListSitesWithContents,
    })) as { data: ListSitesWithContentQuery; errors: any[] };

    const paths = sitesRes.data.listSites.items.reduce((arr, site) => {
      site.contents.items.forEach((content) => {
        arr.push({
          params: { site: site.subdomain, slug: content.slug },
        });
        if (site.customDomain) {
          arr.push({
            params: { site: site.customDomain, slug: content.slug },
          });
        }
      });
      return arr;
    }, []);

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.log(error);
  }
}
