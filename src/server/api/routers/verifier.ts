import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const verifierRouter = createTRPCRouter({
  
  getAllUsers: protectedProcedure
    .input(
      z.object({
        take: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { id: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          usn: true,
          userVerfied: true,
          passClaimed: true,
          idProof: true,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (users.length > input.take) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return { users, nextCursor };
    }),

  updateVerification: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        passClaimed: z.boolean(),
        userVerfied: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          passClaimed: input.passClaimed,
          userVerfied: input.userVerfied,
        },
        select: {
          email: true,
          name: true,
          phoneNumber: true,
        }
      });

      if (updatedUser.email && updatedUser.name) {
        const response = await fetch(
          `${env.CAPTURE_INCRIDEA_URL}/api/verifiedEmail`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.CAPTURE_INCRIDEA_SECRET}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: updatedUser.email,
              name: updatedUser.name,
              phoneNumber: updatedUser.phoneNumber ?? "",
              specialType: "alumni",
            }),
          },
        );

        if (response.status === 200) {
          await ctx.db.user.update({
            where: {
              id: input.userId,
            },
            data: {
              captureUpdated: true,
            },
          });
        }
      }

      return updatedUser;
    }),

  getAllUsersFiltered: protectedProcedure
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
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          usn: true,
          userVerfied: true,
          passClaimed: true,
          idProof: true,
        },
        take: input.take + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: number | undefined = undefined;

      if (users.length > input.take) {
        const nextUser = users.pop();
        nextCursor = nextUser?.id;
      }

      return {
        users,
        nextCursor,
      };
    }),
});
