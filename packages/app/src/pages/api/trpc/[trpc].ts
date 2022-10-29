import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

const errorMessages: Record<string, string> = {
  FALLBACK: "Something went wrong",
} as const;

const t = initTRPC.create();

const appRouter = t.router({
  greeting: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
        error: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.FALLBACK,
        });
      }

      return `Hello ${input.name ?? "world"}!`;
    }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
