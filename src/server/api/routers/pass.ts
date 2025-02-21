import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import Razorpay from "razorpay";
import { TRPCError } from "@trpc/server";
import { Status } from "@prisma/client";

const ALUMNI_REGISTRATION_AMOUNT_IN_INR = 256

export const passRouter = createTRPCRouter({
  claimPass: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(10).max(10).optional(),
        idProof: z.string(),
        usn: z.string(),
        yearOfGraduation: z
          .number()
          .max(2024, { message: "Only an alumnus can claim this pass." }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          email: ctx.session.user.email,
        },
        data: {
          phoneNumber: input.phoneNumber,
          idProof: input.idProof,
          usn: input.usn,
        },
      });
      const razorpayClient = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });
      const razorpayOrder = await razorpayClient.orders.create({
        amount: ALUMNI_REGISTRATION_AMOUNT_IN_INR * 100,
        currency: "INR",
        receipt: user.email,
        payment_capture: true,
      });
      if (!razorpayOrder.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Razorpay order",
        });
      }
      return await ctx.db.paymentOrder.create({
        data: {
          amount: ALUMNI_REGISTRATION_AMOUNT_IN_INR,
          rzpOrderID: razorpayOrder.id,
          User: {
            connect: {
              id: user.id,
            },
          },
          status: "PENDING",
        },
        include: {
          User: true,
        },
      });
    }),

  changePaymentStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        rzpPaymentID: z.string().optional(),
        status: z.nativeEnum(Status),
        response: z.unknown(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.paymentOrder.update({
        where: {
          id: input.orderId,
        },
        data: {
          rzpPaymentID: input.rzpPaymentID ?? undefined,
          status: input.status,
          paymentData: input.response ?? {},
        },
      });
    }),
});
