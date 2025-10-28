import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role
      }
      return session
    },
    async signIn({ user }) {
      // Allow sign in
      return true
    },
    async redirect({ url, baseUrl }) {
      // Get user from database to check role
      const user = await prisma.user.findFirst({
        where: { email: url.includes('email=') ? url.split('email=')[1] : undefined },
        select: { role: true },
      })

      // Role-based redirect after sign in
      if (user?.role) {
        const roleRedirects: Record<string, string> = {
          SUPER_ADMIN: '/dashboard/super-admin',
          FINANCE: '/dashboard/finance',
          TEACHER: '/dashboard/teacher',
          STUDENT: '/dashboard/student',
        }

        const redirectPath = roleRedirects[user.role]
        if (redirectPath) {
          return `${baseUrl}${redirectPath}`
        }
      }

      // Default redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
}
