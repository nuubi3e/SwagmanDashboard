import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Log } from './lib/logs';
import { PERMISSIONTYPE } from './lib/utils/global.utils';

export const middleware = async (req: NextRequest) => {
  const requestedURL =
    req.nextUrl.pathname === '/' ? '/dashboard' : req.nextUrl.pathname;

  // extracting requested page which is present at last of pathname
  const requestedPage = requestedURL.split('/').at(-1) as
    | PERMISSIONTYPE
    | 'dashboard';
  Log.log(requestedPage);
  const authToken = cookies().get('auth')?.value || '';

  if (!authToken)
    // if there is no token then we redirecting user to signin with redirect url as search params
    return NextResponse.redirect(
      new URL(`/login?redirect=${requestedURL}`, req.url)
    );

  if (requestedPage === 'dashboard') return;

  try {
    // Calling api to get permissions
    const res = await fetch(`${process.env.NEXT_URL}/api/permissions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      const error = JSON.parse(await res.text());
      throw new Error(error.message);
    }

    const data = await res.json();

    const permissions: PERMISSIONTYPE[] = data?.data?.permissions || [];

    if (permissions.includes(requestedPage)) return;

    // If user doesn't have permission for requested page then we redirect them to dashboard (which is public right now)
    return NextResponse.redirect(new URL(`/`, req.url));
  } catch (err) {
    Log.error(err);
    return NextResponse.redirect(
      new URL(`/login?redirect=${requestedURL}`, req.url)
    );
  }
};

export const config = {
  matcher: ['/dashboard/:path*'],
};
