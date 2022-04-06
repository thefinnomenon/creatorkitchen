export default async function handler(req, res) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (!req.query.urlPath) {
    return res.status(400).json({ message: 'Missing urlPath parameter' });
  }

  if (!req.query.slug) {
    return res.status(400).json({ message: 'Missing slug parameter' });
  }

  const { urlPath, slug } = req.query;

  try {
    // Rebuild the page to publish the new updates
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
