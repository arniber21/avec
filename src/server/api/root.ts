import { postRouter } from '~/server/api/routers/post'
import { userRouter } from '~/server/api/routers/user'
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'
import {rideRouter} from "~/server/api/routers/ride";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    ride: rideRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
