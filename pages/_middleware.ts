import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub)
  const hostname = req.headers.get('host');
  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // Get subdomain (e.g. <currentHost>.domain.com)
  let currentHost = hostname.replace(process.env.DOMAIN, '');

  // Remove trailing .
  if (currentHost) currentHost = currentHost.slice(0, -1);

  // Don't allow direct targeting of /_sites
  if (pathname.startsWith(`/_sites`))
    return new Response(null, {
      status: 404,
    });

  //console.log(currentHost, hostname, pathname);

  // If path is not an api route
  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    // Rewrite to app landing page
    if (currentHost === 'app') {
      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Rewrite to landing page
    if (currentHost === '' || pathname === '') {
      url.pathname = `/home${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Rewrite to tenant path
    url.pathname = `/_sites/${currentHost}${pathname}`;
    return NextResponse.rewrite(url);
  }
}
