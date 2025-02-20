import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  volunteerProcedure,
} from "../trpc";
import { dependantID2Num, facultyID2Num } from "~/lib/utils";
import { TRPCError } from "@trpc/server";
import { Day } from "@prisma/client";

export const volunteerRouter = createTRPCRouter({
  markAttended: volunteerProcedure
    .input(
      z.object({
        passId: z.string(),
        day: z.nativeEnum(Day),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const type = input.passId.startsWith("F") ? "faculty" : "dependant";

      if (type === "faculty") {
        const facultyId = facultyID2Num(input.passId);
        const faculty = await ctx.db.user.findUnique({
          where: { id: facultyId },
        });
        if (!faculty) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Faculty not found",
          });
        }
        if (input.day === "DAY1") {
          if (faculty.attendedDay1) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Faculty already marked as attended for day 1",
            });
          }
          await ctx.db.user.update({
            where: { id: facultyId },
            data: { attendedDay1: true },
          });
        } else if (input.day === "DAY2") {
          if (faculty.attendedDay2) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Faculty already marked as attended for day 2",
            });
          }
          await ctx.db.user.update({
            where: { id: facultyId },
            data: { attendedDay2: true },
          });
        }
      } else {
        const extraPassId = dependantID2Num(input.passId);
        const extraPass = await ctx.db.extraPass.findUnique({
          where: { id: extraPassId },
        });
        if (!extraPass) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dependant not found",
          });
        }
        if (input.day === "DAY1") {
          if (extraPass.attendedDay1) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Dependant already marked as attended for day 1",
            });
          }
          await ctx.db.extraPass.update({
            where: { id: extraPassId },
            data: { attendedDay1: true },
          });
        } else if (input.day === "DAY2") {
          if (extraPass.attendedDay2) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Dependant already marked as attended for day 2",
            });
          }
          await ctx.db.extraPass.update({
            where: { id: extraPassId },
            data: { attendedDay2: true },
          });
        }
      }
    }),

  getDay: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.clientSettings.findFirst();
  }),
});
