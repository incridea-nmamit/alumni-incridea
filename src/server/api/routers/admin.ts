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
        where: {
          paymentOrderId: {
            not: null,
          },
          PaymentOrder: {
            status: "SUCCESS",
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
      const response = await fetch(
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

      if (response.status === 200) {
        await ctx.db.user.update({
          where: {
            email: ctx.session.user.email,
          },
          data: {
            captureUpdated: true,
          },
        });
      }
    }),
});
