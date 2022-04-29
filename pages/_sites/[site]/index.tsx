import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import {
  siteByCustomDomain,
  contentBySiteAndSlug,
  siteBySubdomain,
  getSite,
  getAuthor,
} from '../../../graphql/queries';
import { Amplify } from 'aws-amplify';
import config from '../../../aws-exports';
Amplify.configure(config);
import {
  SiteByCustomDomainQuery,
  SiteBySubdomainQuery,
  Site,
  GetSiteQuery,
  ContentStatus,
  GetAuthorQuery,
} from '../../../graphql/API';
import { Author } from '../../home/dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

type PostType = {
  id: string;
  content: string;
};

type Props = {
  site: Site;
  author: Author;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export const getSiteUrl = (site: Pick<Site, 'customDomain' | 'subdomain'>) =>
  `${PROTOCOL}${
    site.customDomain && site.customDomain !== '-1' ? site.customDomain : `${site.subdomain}.${ROOT_DOMAIN}`
  }`;

export default function Post({ site, author }: Props) {
  const router = useRouter();

  if (site.contents.items.length === 0) return;

  return (
    <>
      <div className="w-full min-h-screen bg-white flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-2xl min-w-0 bg-white">
          <div className="flex flex-col justify-center items-center mt-8 gap-4">
            <img src={author.avatarUrl || 'default-avatar.png'} className={`w-32 h-32 rounded-full`} alt="avatar" />
            <p>{author.bio}</p>
            <div className="flex gap-8">
              <a href={`mailto:${author.links.email}`} target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon size={'2x'} icon={faEnvelope} className="opacity-70 hover:opacity-100" />
              </a>
              <a href={`https://twitter.com/${author.links.twitter}`} target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon size={'2x'} icon={faTwitter} className="opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>
          <div className="bg-black h-[2px] w-6/12 opacity-30 my-10 mx-auto" />
          <ul>
            {site.contents.items.map((post) => (
              <li key={post.id}>
                <div className="opacity-70 hover:opacity-100">
                  <a href={`${getSiteUrl(site)}/posts/${post.slug}`}>
                    <h1 className="text-2xl mb-1">{post.title}</h1>
                    <p className="mb-3">{new Date(post.createdAt).toLocaleDateString()}</p>
                    <p>{post.description}</p>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// @site: the domain or subdomain (e.g. mysite)
// @slug: the slug for the content (e.g. my-first-post)
// - Retrieves site record by querying siteByDomain index with @site
// - Retrieves content by querying contentBySiteAndSlug with site ID and @slug
export async function getServerSideProps({ params: { site } }) {
  const isCustomDomain = site.includes('.');
  try {
    let siteObj;
    if (isCustomDomain) {
      const { data } = (await API.graphql({
        query: siteByCustomDomain,
        variables: {
          customDomain: site,
        },
      })) as { data: SiteByCustomDomainQuery; errors: any[] };
      if (!data.siteByCustomDomain.items[0]) return { notFound: true };
      siteObj = data.siteByCustomDomain.items[0];
    } else {
      const { data } = (await API.graphql({
        query: siteBySubdomain,
        variables: {
          subdomain: site,
        },
      })) as { data: SiteBySubdomainQuery; errors: any[] };
      if (!data.siteBySubdomain.items[0]) return { notFound: true };
      siteObj = data.siteBySubdomain.items[0];
    }

    const { data } = (await API.graphql({
      query: getSite,
      variables: {
        id: siteObj.id,
      },
    })) as { data: GetSiteQuery; errors: any[] };
    if (!data.getSite) return { notFound: true };

    // Filter out unpublished content
    data.getSite.contents.items = data.getSite.contents.items.filter(
      (content) => content.status === ContentStatus.PUBLISHED
    );

    const { data: authorData } = (await API.graphql({
      query: getAuthor,
      variables: {
        id: data.getSite.username,
      },
    })) as { data: GetAuthorQuery; errors: any[] };
    if (!authorData.getAuthor) return { notFound: true };

    authorData.getAuthor.links = JSON.parse(authorData.getAuthor.links);

    return {
      props: {
        site: data.getSite,
        author: authorData.getAuthor,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
