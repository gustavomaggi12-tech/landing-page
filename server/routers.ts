import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  exercises: router({
    list: publicProcedure
      .input(z.object({
        muscleGroup: z.string().optional(),
        equipmentType: z.string().optional(),
        exerciseType: z.enum(["strength", "cardio", "mobility"]).optional(),
      }))
      .query(({ input }) => db.getExercises(input)),
    
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => db.getExerciseById(input)),
  }),

  workouts: router({
    list: protectedProcedure
      .query(({ ctx }) => db.getUserWorkouts(ctx.user.id)),
    
    getById: protectedProcedure
      .input(z.number())
      .query(({ input }) => db.getWorkoutById(input)),
    
    getExercises: protectedProcedure
      .input(z.number())
      .query(({ input }) => db.getWorkoutExercises(input)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        exercises: z.array(z.object({
          name: z.string().min(1),
          exerciseId: z.number().optional(),
          sets: z.number().min(1),
          reps: z.number().min(1),
          restSeconds: z.number().min(0),
        })).min(1),
      }))
      .mutation(({ ctx, input }) => db.createWorkout(ctx.user.id, input)),
  }),

  programs: router({
    list: publicProcedure
      .query(() => db.getWorkoutPrograms()),
    
    getUserPrograms: protectedProcedure
      .query(({ ctx }) => db.getUserPrograms(ctx.user.id)),
  }),

  userEquipment: router({
    list: protectedProcedure
      .query(({ ctx }) => db.getUserEquipment(ctx.user.id)),
  }),

  sessions: router({
    getRecent: protectedProcedure
      .input(z.number().optional())
      .query(({ ctx, input }) => db.getUserWorkoutSessions(ctx.user.id, input || 10)),
    
    create: protectedProcedure
      .input(z.object({
        workoutId: z.number(),
        durationMinutes: z.number(),
        exerciseLogs: z.array(z.object({
          workoutExerciseId: z.number(),
          setsCompleted: z.number(),
          repsCompleted: z.number().optional(),
          weightUsed: z.number().optional(),
        })),
      }))
      .mutation(({ ctx, input }) =>
        db.createWorkoutSession(
          ctx.user.id,
          input.workoutId,
          input.durationMinutes,
          input.exerciseLogs
        )
      ),
    
    getHistory: protectedProcedure
      .input(z.number().optional())
      .query(({ ctx, input }) => db.getWorkoutHistory(ctx.user.id, input || 20)),
  }),

  stats: router({
    getUserStats: protectedProcedure
      .query(({ ctx }) => db.getUserStats(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
