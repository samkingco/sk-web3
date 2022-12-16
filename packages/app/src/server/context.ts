import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { IncomingMessage, ServerResponse } from "http";
import { type Session } from "next-auth";
import { prisma } from "./db";
import { getServerAuthSession } from "./get-server-auth-session";

type CreateContextOptions = {
  session: Session | null;
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
};

const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    req: opts.req,
    res: opts.res,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
    req,
    res,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
