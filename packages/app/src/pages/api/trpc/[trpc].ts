import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import { graphql } from "../../../graphql";

const graphQlClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/samkingco/example-nft"
);

const errorMessages: Record<string, string> = {
  FALLBACK: "Something went wrong",
} as const;

const inventoryQueryDocument = graphql(/* GraphQL */ `
  query Inventory($owner: String!) {
    tokens(where: { owner: $owner }, first: 100) {
      id
      tokenURI
    }
  }
`);

const t = initTRPC.create();

const appRouter = t.router({
  inventoryByOwner: t.procedure
    .input(
      z.object({
        owner: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await graphQlClient.request(inventoryQueryDocument, {
        owner: input.owner,
      });
    }),
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
