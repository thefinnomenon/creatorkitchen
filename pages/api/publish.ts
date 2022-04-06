import { Amplify, withSSRContext } from 'aws-amplify';
import config from '../../aws-exports.js';

// Amplify SSR configuration needs to be done within each API route
Amplify.configure({ ...config, ssr: true });

export default async function handler(req, res) {
  // TODO: get domain and user session from req and verify that they own the domain
  // const { Auth, API } = withSSRContext({ req });
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }
  // try {
  //   user = await Auth.currentAuthenticatedUser();
  //   console.log('user is authenticated');
  //   // fetch some data and assign it to the data variable
  // } catch (err) {
  //   console.log('error: no authenticated user');
  // }

  if (!req.query.slug) {
    return res.status(400).json({ message: 'Missing slug parameter' });
  }

  const { domain, slug } = req.query;

  try {
    // Rebuild the page to publish the new updates
    // ${domain}
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
