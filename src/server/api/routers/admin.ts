import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  getAllUsers: adminProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        take: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.user.findMany({
        orderBy: {
          id: "asc",
        },
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (users.length > input.take) {
        const nextUser = users.pop();
        nextCursor = nextUser?.id;
      }

      return {
        users,
        nextCursor,
      };
    }),
  getAllDependants: adminProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        take: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const passes = await ctx.db.extraPass.findMany({
        orderBy: {
          id: "asc",
        },
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (passes.length > input.take) {
        const nextPass = passes.pop();
        nextCursor = nextPass?.id;
      }

      return {
        passes,
        nextCursor,
      };
    }),
});
