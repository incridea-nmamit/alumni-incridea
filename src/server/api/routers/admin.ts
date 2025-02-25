import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { env } from "~/env";


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

  toggleAlumniPass: adminProcedure
    .input(
      z.object({
        id: z.number(),
        state: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          passClaimed: input.state,
        },
      });
      await fetch(
        `${env.CAPTURE_INCRIDEA_URL}/api/verifiedEmail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.CAPTURE_INCRIDEA_SECRET}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            specialType: "alumni",
          }),
        },
      );
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      newRole: z.enum(['ADMIN', 'USER', 'VOLUNTEER', 'VERIFIER']),
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
