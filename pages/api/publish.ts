import { Amplify, withSSRContext } from 'aws-amplify';
import config from '../../aws-exports.js';
import {
  ContentBySiteAndSlugQuery,
  SiteByDomainQuery,
} from '../../graphql/API';
import { contentBySiteAndSlug, siteByDomain } from '../../graphql/queries';

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
  const domain = req.headers.host;
  if (!domain)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // Get subdomain (e.g. <currentHost>.domain.com)
  let subdomain = domain.replace(process.env.DOMAIN, '');

  // Remove trailing .
  if (subdomain) subdomain = subdomain.slice(0, -1);

  console.log(domain, subdomain);

  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (e) {
    return res
      .status(401)
      .json({ message: 'You must be authenticated to publish' });
  }

  try {
    const siteRes = (await API.graphql({
      query: siteByDomain,
      variables: {
        domain: subdomain || domain,
      },
    })) as { data: SiteByDomainQuery; errors: any[] };
    if (!siteRes.data.siteByDomain.items[0]) return { notFound: true };

    const { data } = (await API.graphql({
      query: contentBySiteAndSlug,
      variables: {
        siteID: { eq: siteRes.data.siteByDomain.items[0].id },
        slug,
      },
    })) as { data: ContentBySiteAndSlugQuery; errors: any[] };
    if (!data.contentBySiteAndSlug.items[0]) return { notFound: true };

    if (data.contentBySiteAndSlug.items[0].author !== user.username)
      return new Response(null, {
        status: 401,
        statusText: 'User is not authorized to publish',
      });
  } catch (error) {
    return new Response(null, {
      status: 404,
      statusText: 'Content not found',
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
    console.log(`[Next.js] Revalidating /posts/${slug}`);
    await res.unstable_revalidate(`/posts/${slug}`);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}