import { Amplify, withSSRContext } from 'aws-amplify';
import config from '../../aws-exports.js';
import {
  ContentBySiteAndSlugQuery,
  ContentStatus,
  CreateContentMutation,
  SiteByCustomDomainQuery,
  SiteBySubdomainQuery,
} from '../../graphql/API';
import { createContent } from '../../graphql/mutations';
import { contentBySiteAndSlug, siteByCustomDomain, siteBySubdomain } from '../../graphql/queries';

// Amplify SSR configuration needs to be done within each API route
Amplify.configure({ ...config, ssr: true });

export default async function handler(req, res) {
  req.headers['cookie'] = JSON.parse(req.body);
  const { Auth, API } = withSSRContext({ req });

  if (!req.query.slug) {
    return res.status(400).json({ message: 'Missing slug parameter' });
  }
  const { slug } = req.query;

  // Get hostname of request (e.g. demo.vercel.pub)
  let hostname = req.headers['host'];
  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // If hostname includes default domain then get subdomain (if exists)
  // else, hostname is the custom domain
  let domain, subdomain;
  if (hostname.includes(process.env.DOMAIN)) {
    subdomain = hostname.replace(process.env.DOMAIN, '').slice(0, -1);
  } else {
    domain = hostname;
  }

  console.log(domain, subdomain);

  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (e) {
    return res.status(401).json({ message: 'You must be authenticated to publish' });
  }

  let siteObj;
  try {
    if (domain) {
      const siteRes = (await API.graphql({
        query: siteByCustomDomain,
        variables: {
          customDomain: domain,
        },
      })) as { data: SiteByCustomDomainQuery; errors: any[] };
      if (!siteRes.data.siteByCustomDomain.items[0]) return { notFound: true };
      siteObj = siteRes.data.siteByCustomDomain.items[0];
    } else {
      const siteRes = (await API.graphql({
        query: siteBySubdomain,
        variables: {
          subdomain,
        },
      })) as { data: SiteBySubdomainQuery; errors: any[] };
      if (!siteRes.data.siteBySubdomain.items[0]) return { notFound: true };
      siteObj = siteRes.data.siteBySubdomain.items[0];
    }

    console.log(siteObj);

    const { data } = (await API.graphql({
      query: contentBySiteAndSlug,
      variables: {
        siteID: { eq: siteObj.id },
        slug,
      },
    })) as { data: ContentBySiteAndSlugQuery; errors: any[] };
    if (!data.contentBySiteAndSlug.items[0])
      return new Response(null, {
        status: 404,
        statusText: 'Failed to find content',
      });

    if (data.contentBySiteAndSlug.items[0].author !== user.username)
      return new Response(null, {
        status: 401,
        statusText: 'User is not authorized to publish',
      });

    const draft = data.contentBySiteAndSlug.items[0];
    console.log(draft);
    const originalCreatedAt = draft.createdAt;
    const draftID = draft.id;
    delete draft.id;
    delete draft.published;
    delete draft.createdAt;
    delete draft.updatedAt;

    const createRes = (await API.graphql({
      query: createContent,
      variables: {
        input: {
          ...draft,
          parentID: draftID,
          status: ContentStatus.PUBLISHED,
          originalCreatedAt,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: CreateContentMutation; errors: any[] };
    //console.log(createRes.data.createContent);
  } catch (error) {
    console.log(error);
    return new Response(null, {
      status: 500,
      statusText: 'Failed to publish',
    });
  }

  // If in dev mode, unstable_revalidate doesn't work so just return success
  if (process && process.env.NODE_ENV === 'development') {
    return res.json({ revalidated: true });
  }

  try {
    // Rebuild the page to publish the new updates
    // This API is called with the current domain (e.g. chris.creatorkitchen.net/publish?...),
    // so the proper routing will happen automatically
    //console.log(`[Next.js] Revalidating /posts/${slug}`);
    await res.unstable_revalidate(`/posts/${slug}`);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
