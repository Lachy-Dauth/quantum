import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth enforcement is added in INFRA_AUTH
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
