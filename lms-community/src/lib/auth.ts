import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import type { Role } from "@prisma/client"

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      accessToken?: string
      refreshToken?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    accessToken?: string
    refreshToken?: string
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request offline access for refresh token
          access_type: "offline",
          prompt: "consent",
          // Scopes for Google Drive access
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.readonly"
          ].join(" "),
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth provider sign-in
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user with default STUDENT role
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: "STUDENT", // Default role for new users
                emailVerified: new Date(),
                googleId: account.providerAccountId,
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token,
              },
            })
          } else {
            // Update OAuth tokens for existing user
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token,
              },
            })
          }
          return true
        } catch (error) {
          console.error("Error during sign-in:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Store OAuth tokens in JWT
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }

      // Fetch latest user data from database
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            id: true,
            role: true,
            googleAccessToken: true,
            googleRefreshToken: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.accessToken = dbUser.googleAccessToken || undefined
          token.refreshToken = dbUser.googleRefreshToken || undefined
        }
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        console.log(`New user registered: ${user.email} with role STUDENT`)
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
})
