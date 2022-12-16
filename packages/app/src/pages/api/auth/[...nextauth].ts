import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { prisma } from "../../../server/db";

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);

          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          const csrf = await getCsrfToken({ req });
          if (siwe.nonce !== csrf) {
            return null;
          }

          await siwe.validate(credentials?.signature || "");

          const address = siwe.address;

          const user = await prisma.user.findFirst({
            where: {
              ethWallet: { address: { equals: address } },
            },
          });

          if (!user) {
            await prisma.user.create({
              data: {
                ethWallet: {
                  create: {
                    address: address,
                  },
                },
              },
            });
          }

          return {
            id: address,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
      credentials: {
        message: {
          label: "Message",
          placeholder: "0x0",
          type: "text",
        },
        signature: {
          label: "Signature",
          placeholder: "0x0",
          type: "text",
        },
      },
      name: "Ethereum",
    }),
  ];

  return {
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub || "";
        session.chainId = 1;
        return session;
      },
    },
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
  };
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const authOptions = getAuthOptions(req);

  if (!Array.isArray(req.query.nextauth)) {
    res.status(400).send("Bad request");
    return;
  }

  const isDefaultSigninPage =
    req.method === "GET" &&
    req.query.nextauth.find((value) => value === "signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    authOptions.providers.pop();
  }

  return await NextAuth(req, res, authOptions);
}
