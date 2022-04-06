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

  // Get subdomain
  let currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`creatorkitchen.net`, '')
      : hostname.replace(`localhost:3000`, '');

  if (currentHost) {
    currentHost = currentHost.slice(0, -1);
  }

  // Don't allow direct targeting of /_sites
  if (pathname.startsWith(`/_sites`))
    return new Response(null, {
      status: 404,
    });

  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    // Rewrite to app landing page
    if (currentHost === 'app') {
      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Rewrite to landing page
    // if (hostname === 'localhost:3000' || hostname === 'creatorkitchen.net') {
    //   url.pathname = `/home${pathname}`;
    //   return NextResponse.rewrite(url);
    // }

    console.log(currentHost, pathname, hostname);

    // Rewrite to landing page
    if (currentHost === '' || pathname === '') {
      url.pathname = `/home${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Rewrite to tenant path
    url.pathname = `/_sites/${currentHost}${pathname}`;
    console.log(url.pathname);
    return NextResponse.rewrite(url);
  }
}
