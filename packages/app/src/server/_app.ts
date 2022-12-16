import { authRouter } from "./routers/auth";
import { inventoryRouter } from "./routers/inventory";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  inventory: inventoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
