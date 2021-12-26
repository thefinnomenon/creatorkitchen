import { NextApiRequest, NextApiResponse } from 'next';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: 'GUKEI6ss7McEFuxAM0CxwVLQcjwvcY4SSDGE0Epe_00',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query as string;
  const response = await unsplash.search.getPhotos({
    query,
    orientation: 'landscape',
  });
  console.log(query, response);
  res.status(200).json({ results: response.response.results });
}
