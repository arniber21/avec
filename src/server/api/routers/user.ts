import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// User API
// Defines actions or queries that a user can take relating to their account
export const userRouter = createTRPCRouter({
    // Get user by ID
    getById: publicProcedure
        .input(z.string())
        .query(({ ctx, input }) => {
            return ctx.db.user.findUnique({
                where: { id: input },
            });
        }),

    // Update user profile
    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                image: z.string().url().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: input,
            });
        }),

    // Get all rides joined by the user
    getJoinedRides: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
                joinedRides: true,
            },
        });
    }),

    // Get all rides hosted by the user
    getHostedRides: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
                hostedRides: true,
            },
        });
    }),
});