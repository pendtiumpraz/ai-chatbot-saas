import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Role-based redirects after login
    if (path === "/dashboard" && token?.role) {
      const roleRedirects = {
        SUPER_ADMIN: "/dashboard/super-admin",
        FINANCE: "/dashboard/finance",
        TEACHER: "/dashboard/teacher",
        STUDENT: "/dashboard/student",
      }

      const redirectPath = roleRedirects[token.role as keyof typeof roleRedirects]
      if (redirectPath && path !== redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, req.url))
      }
    }

    // Role-based access control
    if (path.startsWith("/dashboard/super-admin") && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/dashboard/finance") && token?.role !== "FINANCE") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/dashboard/teacher") && token?.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/dashboard/student") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
}
