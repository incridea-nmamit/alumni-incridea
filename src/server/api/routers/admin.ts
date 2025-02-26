import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

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

  getAllPaidUsers: adminProcedure
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
        where: {
          PaymentOrder: {
            some: {
              status: "SUCCESS",
            }
          },
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
    getAllVerifiedUsers: protectedProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        where: {
          PaymentOrder: {
            some: {
              status: "SUCCESS",
            }
          },
          role: "ALUMNI"
        },
      });
      return users;
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      newRole: z.enum(['ADMIN', 'USER', 'VOLUNTEER', 'VERIFIER', 'ALUMNI', 'UNVERIFIED', 'PRONITECOM', 'SCAMMER']),
    }))
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id }
      });

      if (currentUser?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.newRole }
      });
    }),
});
