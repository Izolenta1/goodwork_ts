import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export const config = {
    matcher: ["/api/:route*", "/auth/:route*", "/static/:static*"],
};

export function middleware(request: NextRequest) {
    return NextResponse.rewrite(new URL(`${process.env.BACKEND_URI}${request.nextUrl.pathname}${request.nextUrl.search}`), { request });
}