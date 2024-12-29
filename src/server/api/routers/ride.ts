import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

/**
 * Ride API Router
 * Defines actions or queries that a user can take relating to rides.
 */
export const rideRouter = createTRPCRouter({
    /**
     * Retrieve all rides.
     */
    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.ride.findMany();
    }),

    /**
     * Search for rides matching the query.
     * @param {Object} input - The search criteria.
     * @param {string} input.fromLocation - The starting location.
     * @param {string} input.toLocation - The destination location.
     * @param {Date} input.date - The date of the ride.
     * @returns {Promise<Array>} List of rides matching the criteria.
     */
    search: publicProcedure
        .input(
            z.object({
                fromLocation: z.string(),
                toLocation: z.string(),
                date: z.date(),
            })
        )
        .query(async ({ ctx, input }) => {
            const rides = await ctx.db.ride.findMany({
                where: {
                    fromLocation: input.fromLocation,
                    toLocation: input.toLocation,
                },
            });

            return rides.filter((ride) => (ride.time >= input.date));
        }),

    // Create a new ride
    create: protectedProcedure
        .input(
            z.object({
                fromLocation: z.string(),
                toLocation: z.string(),
                time: z.date(),
                description: z.string(),
                carDescription: z.string(),
                price: z.number(),
                capacity: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.ride.create({
                data: {
                    fromLocation: input.fromLocation,
                    toLocation: input.toLocation,
                    time: input.time,
                    description: input.description,
                    carDescription: input.carDescription,
                    price: input.price,
                    capacity: input.capacity,
                    driverId: ctx.session.user.id,
                },
            });
        }),

    /**
     * Update a ride.
     * @param {Object} input - The ride details to update.
     * @param {string} input.id - The ID of the ride.
     * @param {string} input.fromLocation - The starting location.
     * @param {string} input.toLocation - The destination location.
     * @param {Date} input.time - The time of the ride.
     * @param {string} input.description - The description of the ride.
     * @param {string} input.carDescription - The description of the car.
     * @param {number} input.price - The price of the ride.
     * @param {number} input.capacity - The capacity of the ride.
     * @returns {Promise<Object>} The updated ride.
     */
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                fromLocation: z.string(),
                toLocation: z.string(),
                time: z.date(),
                description: z.string(),
                carDescription: z.string(),
                price: z.number(),
                capacity: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.ride.update({
                where: { id: input.id },
                data: {
                    fromLocation: input.fromLocation,
                    toLocation: input.toLocation,
                    time: input.time,
                    description: input.description,
                    carDescription: input.carDescription,
                    price: input.price,
                    capacity: input.capacity,
                },
            });
        }),

    /**
     * Get all rides for which the user is a driver.
     * @returns {Promise<Array>} List of rides where the user is the driver.
     */
    findAllByDriver: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.ride.findMany({
            where: {
                driverId: ctx.session.user.id,
            },
        });
    }),

    /**
     * Join a ride.
     * @param {Object} input - The ride details.
     * @param {string} input.rideId - The ID of the ride to join.
     * @returns {Promise<Object>} The updated ride.
     * @throws Will throw an error if the ride is not found or is already full.
     */
    joinRide: protectedProcedure
        .input(
            z.object({
                rideId: z.string(), // ID of the ride to join
            })
        )
        .mutation(async ({ ctx, input }) => {
            const ride = await ctx.db.ride.findUnique({
                where: { id: input.rideId },
            });

            if (!ride) {
                throw new Error("Ride not found.");
            }

            if (ride.filled || ride.seatsTaken >= ride.capacity) {
                throw new Error("Ride is already full.");
            }

            const userJoined = await ctx.db.user.findFirst({
                where: {
                    id: ctx.session.user.id,
                    joinedRides: {
                        some: {
                            id: input.rideId,
                        },
                    },
                },
            });

            if (userJoined) {
                throw new Error("You have already joined this ride.");
            }

            await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: {
                    joinedRides: {
                        connect: { id: input.rideId },
                    },
                },
            });

            return ctx.db.ride.update({
                where: { id: input.rideId },
                data: {
                    seatsTaken: ride.seatsTaken + 1,
                    filled: ride.seatsTaken + 1 >= ride.capacity,
                },
            });
        }),

    /**
     * Leave a ride.
     * @param {Object} input - The ride details.
     * @param {string} input.rideId - The ID of the ride to leave.
     * @returns {Promise<Object>} The updated ride.
     * @throws Will throw an error if the ride is not found or the user has not joined the ride.
     */
    leaveRide: protectedProcedure
        .input(
            z.object({
                rideId: z.string(), // ID of the ride to leave
            })
        )
        .mutation(async ({ ctx, input }) => {
            const ride = await ctx.db.ride.findUnique({
                where: { id: input.rideId },
            });

            if (!ride) {
                throw new Error("Ride not found.");
            }

            const userJoined = await ctx.db.user.findFirst({
                where: {
                    id: ctx.session.user.id,
                    joinedRides: {
                        some: {
                            id: input.rideId,
                        },
                    },
                },
            });

            if (!userJoined) {
                throw new Error("You have not joined this ride.");
            }

            await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: {
                    joinedRides: {
                        disconnect: { id: input.rideId },
                    },
                },
            });

            return ctx.db.ride.update({
                where: { id: input.rideId },
                data: {
                    seatsTaken: ride.seatsTaken - 1,
                    filled: false,
                },
            });
        }),
});