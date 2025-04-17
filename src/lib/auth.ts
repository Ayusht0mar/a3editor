import NextAuth from "next-auth"

import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        }
      }
    }),
    Resend({
      from: process.env.EMAIL_FROM,
      apiKey: process.env.AUTH_RESEND_KEY,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      if (!user.email) return false

      // For email (magic link) verification requests
      if (email?.verificationRequest) {
        return true
      }

      try {
        // Find existing user
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        })

        if (existingUser) {
          // Check if trying to sign in with a different provider
          if (account && !existingUser.accounts.some(acc => acc.provider === account.provider)) {
            // Create new account link
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at ? Math.floor(account.expires_at) : null,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token?.toString() || null,
                session_state: account.session_state?.toString() || null,
              },
            })
            return true
          }

          // If account already exists for this provider, allow sign in
          if (existingUser.accounts.some(acc => acc.provider === account?.provider)) {
            return true
          }

          // Special handling for Google sign-in
          if (account?.provider === "google" && profile?.email_verified) {
            // If email is verified by Google, allow linking
            return true
          }
        }

        // For new users
        if (!existingUser) {
          // Allow creation of new account
          return true
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Get all linked providers for this user
        const accounts = await prisma.account.findMany({
          where: { userId: user.id },
          select: { provider: true },
        })
        
        session.user.providers = accounts.map(acc => acc.provider)
      }
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider
        
        // Get all providers for this user
        const accounts = await prisma.account.findMany({
          where: { userId: token.sub as string },
          select: { provider: true },
        })
        
        token.providers = accounts.map(acc => acc.provider)
      }
      return token
    }
  },
  pages: {
    signIn: '/get-started',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async linkAccount({ user, account }) {
      console.log(`Account linked: ${account.provider} for user ${user.email}`)
    },
  },
  debug: true, // Enable debug mode to see detailed errors
})