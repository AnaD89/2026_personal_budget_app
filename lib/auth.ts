import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  // 🔥 FORȚĂM pagina de login
  pages: {
    signIn: "/login",
  },

  
callbacks: {
  async redirect({ url, baseUrl }) {
    // 🚫 Blochează complet redirect către API
    if (url.includes("/api/")) {
      return baseUrl;
    }
    if (url.startsWith(baseUrl)) {
      return url;
    }
    return baseUrl;
  },
},
};