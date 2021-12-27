import { NextApiRequest, NextApiResponse } from 'next';
import { GiphyFetch } from '@giphy/js-fetch-api';

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch(process.env.GIPHY_API_KEY);

// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

// Render the React Component and pass it your fetchGifs as a prop

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query as string;
  const limit = req.query.limit as string;

  const response = await gf.search(query, { limit: parseInt(limit) });

  res.status(200).json({ results: response });
}
