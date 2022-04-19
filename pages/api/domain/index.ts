// Adapted from https://github.com/vercel/platforms/blob/main/pages/api/domain/index.ts
// and https://github.com/vercel/platforms/blob/main/lib/api/domain.ts
import { Amplify, withSSRContext } from 'aws-amplify';
import config from '../../../aws-exports.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GetSiteQuery, SiteByCustomDomainQuery, UpdateSiteMutation } from '../../../graphql/API';
import { updateSite } from '../../../graphql/mutations';
import { getSite, siteByCustomDomain } from '../../../graphql/queries';

// Amplify SSR configuration needs to be done within each API route
Amplify.configure({ ...config, ssr: true });

export enum HttpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}
export default async function domain(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case HttpMethod.POST:
      return createDomain(req, res);
    case HttpMethod.DELETE:
      return deleteDomain(req, res);
    default:
      res.setHeader('Allow', [HttpMethod.POST, HttpMethod.DELETE]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Add Domain
 *
 * Adds a new domain to the Vercel project using a provided
 * `domain` & `siteId` query parameters
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createDomain(req: NextApiRequest, res: NextApiResponse): Promise<void | NextApiResponse> {
  const { Auth, API } = withSSRContext({ req });
  const { domain, siteId } = req.query;

  console.log(`Create Domain ${domain}`);

  // Custom domain cannot include the service domain
  if (domain.includes(process.env.DOMAIN)) return res.status(403).end();

  if (Array.isArray(domain) || Array.isArray(siteId))
    return res.status(400).end('Bad request. Query parameters are not valid.');

  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (e) {
    return res.status(401).json({
      message: 'You must be authenticated to add/remove custom domain',
    });
  }

  try {
    // CHECK that site exists, user is owner, and if already has custom domain
    const { data } = (await API.graphql({
      query: getSite,
      variables: {
        id: siteId,
      },
    })) as { data: GetSiteQuery; errors: any[] };

    // Does site exist?
    if (!data.getSite)
      return res.status(400).json({
        message: 'Site does not exist',
      });
    console.log('Site exists');
    // Is user owner?
    if (data.getSite.username !== user.username)
      return res.status(403).json({
        message: 'You must be the site owner to add a custom domain',
      });
    console.log('User is owner');
    // Does the site already have a custom domain?
    // Note: '-1' is the same as no domain, since it is a index I can't set it to null
    if (data.getSite.customDomain && data.getSite.customDomain !== '-1') {
      console.log('Site has custom domain... deleting it...');
      req.query['domain'] = data.getSite.customDomain;
      await deleteDomain(req, res);
    } else {
      console.log('Site does not have custom domain set');
    }

    // CHECK if domain is already in use
    if (!domain) {
      const siteByDomainRes = (await API.graphql({
        query: siteByCustomDomain,
        variables: {
          customDomain: domain,
        },
      })) as { data: SiteByCustomDomainQuery; errors: any[] };

      if (siteByDomainRes.data.siteByCustomDomain.items.length !== 0)
        return res.status(400).json({
          message: 'Domain in use',
        });
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const response = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
      body: `{\n  "name": "${domain}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: HttpMethod.POST,
    });

    const data = await response.json();

    if (response.status === 400) return res.status(400).end();

    // Domain is already owned by another team but you can request delegation to access it
    if (data.error?.code === 'forbidden') return res.status(403).end();

    // Domain is already being used by a different project
    if (data.error?.code === 'domain_taken') return res.status(409).end();

    console.log(`Created entry for ${domain}`);

    // add www redirect
    // const response2 = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
    //   body: `{\n  "name": "www.${domain}",\n  "redirect": "${domain}", \n  "redirectStatusCode": 308\n}`,
    //   headers: {
    //     Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   method: HttpMethod.POST,
    // });

    // const data2 = await response2.json();

    // if (response2.status === 400) return res.status(400).end();

    // // Domain is already owned by another team but you can request delegation to access it
    // if (data2.error?.code === 'forbidden') return res.status(403).end();

    // // Domain is already being used by a different project
    // if (data2.error?.code === 'domain_taken') return res.status(409).end();

    // console.log(`Created entry and redirect for www.${domain}`);

    // Domain is successfully added, update site
    try {
      const { data } = (await API.graphql({
        query: updateSite,
        variables: {
          input: {
            id: siteId,
            customDomain: domain,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: UpdateSiteMutation; errors: any[] };
    } catch (e) {
      console.log(e);
      // Record update failed so we should undo the domain add
      await deleteDomain(req, res);
      return res.status(500).end(e);
    }

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Domain
 *
 * Remove a domain from the vercel project using a provided
 * `domain` & `siteId` query parameters
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteDomain(req: NextApiRequest, res: NextApiResponse): Promise<void | NextApiResponse> {
  const { Auth, API } = withSSRContext({ req });
  const { domain, siteId } = req.query;

  console.log(`Deleting Domain ${domain}`);

  if (Array.isArray(domain) || Array.isArray(siteId))
    res.status(400).end('Bad request. Query parameters cannot be an array.');

  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (e) {
    return res.status(401).json({
      message: 'You must be authenticated to add/remove custom domain',
    });
  }

  try {
    const { data } = (await API.graphql({
      query: getSite,
      variables: {
        id: siteId,
      },
    })) as { data: GetSiteQuery; errors: any[] };

    // Does site exist?
    if (!data.getSite)
      return res.status(400).json({
        message: 'Site does not exist',
      });
    console.log('Site exists');
    // Is user owner?
    if (data.getSite.username !== user.username)
      return res.status(403).json({
        message: 'You must be the site owner to add a custom domain',
      });
    console.log('User is owner');
    // Does the site have the domain we are deleting
    if (data.getSite.customDomain !== domain)
      return res.status(400).json({
        message: 'Site does not own domain',
      });
    console.log('Sites domain matches');
  } catch (e) {
    console.log(e);
  }

  try {
    // Remove www redirect
    // const response = await fetch(
    //   `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/www.${domain}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
    //     },
    //     method: HttpMethod.DELETE,
    //   }
    // );

    // console.log('Removed www redirect');

    const response2 = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
        },
        method: HttpMethod.DELETE,
      }
    );

    if (response2.status === 200) console.log('Removed domain');

    // Domain is successfully removed, update site
    try {
      const { data } = (await API.graphql({
        query: updateSite,
        variables: {
          input: {
            id: siteId,
            customDomain: '-1',
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: UpdateSiteMutation; errors: any[] };
    } catch (e) {
      console.log(e);
      return res.status(500).end(e);
    }
    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
