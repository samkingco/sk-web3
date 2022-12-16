import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import { graphql } from "../../graphql";
import { publicProcedure, router } from "../trpc";

const graphQlClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/samkingco/example-nft"
);

const inventoryQueryDocument = graphql(/* GraphQL */ `
  query Inventory($owner: String!) {
    tokens(where: { owner: $owner }, first: 100) {
      id
      tokenURI
    }
  }
`);

export const inventoryRouter = router({
  byOwner: publicProcedure
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
});
