import { NextApiRequest, NextApiResponse } from 'next';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query as string;
  const per_page = req.query.per_page as string;

  const response = await unsplash.search.getPhotos({
    query,
    perPage: parseInt(per_page),
    orientation: 'landscape',
  });

  res.status(200).json({ results: response.response.results });
}
