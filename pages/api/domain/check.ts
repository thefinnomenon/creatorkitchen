// Adapted from https://github.com/vercel/platforms/blob/main/pages/api/domain/check.ts
import { withSSRContext } from 'aws-amplify';
import type { NextApiRequest, NextApiResponse } from 'next';
import { SiteBySubdomainQuery } from '../../../graphql/API';
import { siteBySubdomain } from '../../../graphql/queries';

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

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const { API } = withSSRContext({ req });

  if (req.method !== HttpMethod.GET) {
    res.setHeader('Allow', [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, subdomain = false } = req.query;

  if (Array.isArray(domain))
    return res
      .status(400)
      .end('Bad request. domain parameter cannot be an array.');

  try {
    if (subdomain) {
      const sub = domain.replace(/[^a-zA-Z0-9/-]+/g, '');

      const { data } = (await API.graphql({
        query: siteBySubdomain,
        variables: {
          subdomain: sub,
        },
      })) as { data: SiteBySubdomainQuery; errors: any[] };

      const available = data.siteBySubdomain.items === null && sub.length !== 0;

      return res.status(200).json(available);
    }

    const response = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/config`,
      {
        method: HttpMethod.GET,
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    const valid = data?.configuredBy ? true : false;

    return res.status(200).json(valid);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
