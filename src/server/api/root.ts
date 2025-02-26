import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { passRouter } from "./routers/pass";
import { adminRouter } from "./routers/admin";
import { volunteerRouter } from "./routers/volunteer";
import { verifierRouter } from "./routers/verifier";
import { auditLog } from "./routers/auditlog";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pass: passRouter,
  admin: adminRouter,
  volunteer: volunteerRouter,
  verifier: verifierRouter,
  audit: auditLog,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
