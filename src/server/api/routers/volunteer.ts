import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  volunteerProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Day } from "@prisma/client";
import { alumniID2Num } from "~/lib/utils";

export const volunteerRouter = createTRPCRouter({
  markAttended: volunteerProcedure
    .input(
      z.object({
        passId: z.string(),
        day: z.nativeEnum(Day),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.day === "DAY1") {
        await ctx.db.user.update({
          where: {
            id: alumniID2Num(input.passId),
          },
          data: {
            attendedDay1: true,
          },
        });
      } else if (input.day === "DAY2") {
        await ctx.db.user.update({
          where: {
            id: alumniID2Num(input.passId),
          },
          data: {
            attendedDay2: true,
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid day",
        });
      }
    }),

  getDay: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.clientSettings.findFirst();
  }),
});
