// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client" // This imports your Enum from Prisma

declare module "next-auth" {
  interface Session {
    user: {
      role: Role
    } & DefaultSession["user"]
  }
  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
  }
}