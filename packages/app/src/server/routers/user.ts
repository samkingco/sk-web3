import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db";
import { ERROR_MESSAGES } from "../errors";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  greeting: publicProcedure
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
          message: ERROR_MESSAGES.FALLBACK,
        });
      }

      return `Hello ${input.name ?? "world"}!`;
    }),
  getUserFromSession: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({
      where: { ethWallet: { address: { equals: ctx.session.address } } },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user;
  }),
});
