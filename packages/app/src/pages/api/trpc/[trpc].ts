import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createContext } from "../../../server/context";
import { appRouter } from "../../../server/_app";

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error }) => {
    console.error(`tRPC failed on ${path}: ${error}`);
  },
});
