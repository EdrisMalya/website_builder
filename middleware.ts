import { authMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/*const isPublicRoute = createRouteMatcher([
    '/agency/sign-in(.*)',
    '/agency/sign-up(.*)',
    '/site(.*)',
])*/

/*export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect()
    }
})*/

export default authMiddleware({
    publicRoutes: ['/site', '/api/uploadthing'],
    async beforeAuth(auth, req) {},
    async afterAuth(auth, req) {
        const url = req.nextUrl
        const searchParams = url.searchParams.toString()
        let hostname = req.headers
        const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

        // If subdomain exists
        const customSubdomain = hostname
            .get('host')
            ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
            .filter(Boolean)[0]

        if (customSubdomain) {
            return NextResponse.rewrite(
                new URL(`/${customSubdomain}${pathWithSearchParams}`, req.url),
            )
        }

        if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
            return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
        }
        if (
            url.pathname === '/' ||
            (url.pathname === '/site' &&
                url.host === process.env.NEXT_PUBLIC_DOMAIN)
        ) {
            return NextResponse.rewrite(new URL('/site', req.url))
        }

        if (
            url.pathname.startsWith('/agency') ||
            url.pathname.startsWith('/subaccount')
        ) {
            return NextResponse.rewrite(
                new URL(`${pathWithSearchParams}`, req.url),
            )
        }
    },
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
