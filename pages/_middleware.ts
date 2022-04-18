import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub)
  let hostname = req.headers.get('host');
  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: 'No hostname found in request headers',
    });

  // If hostname includes default domain then currentHost is the subdomain (if exists)
  // else, currentHost is the custom domain
  let currentHost = hostname.includes(process.env.DOMAIN)
    ? hostname.replace(process.env.DOMAIN, '').slice(0, -1)
    : hostname;

  // Don't allow direct targeting of /_sites
  if (pathname.startsWith(`/_sites`))
    return new Response(null, {
      status: 404,
    });

  // console.log(`Middleware routing: currentHost(${currentHost}), hostname(${hostname}), pathname(${pathname})`);

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
