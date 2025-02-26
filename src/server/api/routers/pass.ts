import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import Razorpay from "razorpay";
import { TRPCError } from "@trpc/server";
import { Status } from "@prisma/client";

// Fixed registration amount for alumni in INR
const ALUMNI_REGISTRATION_AMOUNT_IN_INR = 256

export const passRouter = createTRPCRouter({
  // Endpoint: Handles alumni pass registration and payment initiation
  // Requires authentication and validates user input
  claimPass: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(10).max(10).optional(), // Optional phone number validation
        idProof: z.string(), // ID proof document reference
        usn: z.string(), // University Serial Number
        yearOfGraduation: z
          .number()
          .max(2024, { message: "Only an alumnus can claim this pass." }), // Ensures user is an alumnus
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update user profile with provided details
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

      // Initialize Razorpay payment gateway client
      const razorpayClient = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });

      // Create a new payment order in Razorpay
      // Amount is multiplied by 100 as Razorpay expects amount in paise
      const razorpayOrder = await razorpayClient.orders.create({
        amount: ALUMNI_REGISTRATION_AMOUNT_IN_INR * 100,
        currency: "INR",
        receipt: user.email,
        payment_capture: true,
      });

      // Verify order creation was successful
      if (!razorpayOrder.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Razorpay order",
        });
      }

      // Create a local record of the payment order
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

  // Endpoint: Updates payment status after payment completion/failure
  // Requires authentication and validates payment details
  changePaymentStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(), // Local payment order ID
        rzpPaymentID: z.string().optional(), // Razorpay payment ID (present on successful payments)
        status: z.nativeEnum(Status), // Payment status (PENDING/SUCCESS/FAILED)
        response: z.unknown(), // Raw payment response data from Razorpay
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update local payment record with final status and payment details
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
