import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, exercises, workouts, workoutExercises, workoutSessions, userEquipment, workoutPrograms, userPrograms, sessionExerciseLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Exercises
export async function getExercises(filters?: { muscleGroup?: string; equipmentType?: string; exerciseType?: string }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.muscleGroup) conditions.push(eq(exercises.muscleGroup, filters.muscleGroup));
  if (filters?.equipmentType) conditions.push(eq(exercises.equipmentType, filters.equipmentType));
  if (filters?.exerciseType) conditions.push(eq(exercises.exerciseType, filters.exerciseType as any));

  if (conditions.length > 0) {
    return db.select().from(exercises).where(and(...conditions));
  }

  return db.select().from(exercises);
}

export async function getExerciseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Workouts
export async function getUserWorkouts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function getWorkoutById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getWorkoutExercises(workoutId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workoutExercises).where(eq(workoutExercises.workoutId, workoutId));
}

export async function createWorkout(
  userId: number,
  data: {
    name: string;
    description?: string;
    exercises: Array<{
      name: string;
      exerciseId?: number;
      sets: number;
      reps: number;
      restSeconds: number;
    }>;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Insert workout
    const result = await db.insert(workouts).values({
      userId,
      name: data.name,
      description: data.description || null,
      isTemplate: false,
    });

    const workoutId = (result[0] as any).insertId as number;

    // Insert workout exercises
    if (data.exercises.length > 0) {
      // Get a valid fallback exerciseId if needed
      let fallbackExerciseId: number | null = null;
      const needsFallback = data.exercises.some(ex => !ex.exerciseId);
      if (needsFallback) {
        const firstExercise = await db.select().from(exercises).limit(1);
        fallbackExerciseId = firstExercise.length > 0 ? firstExercise[0].id : null;
      }

      const exercisesToInsert = data.exercises
        .map((ex, index) => {
          const exerciseId = ex.exerciseId || fallbackExerciseId;
          if (!exerciseId) return null;
          return {
            workoutId,
            exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            orderIndex: index,
            notes: ex.name,
          };
        })
        .filter((ex): ex is NonNullable<typeof ex> => ex !== null);

      if (exercisesToInsert.length > 0) {
        await db.insert(workoutExercises).values(exercisesToInsert);
      }
    }

    return { id: workoutId, ...data };
  } catch (error) {
    console.error("[Database] Failed to create workout:", error);
    throw error;
  }
}

// User Equipment
export async function getUserEquipment(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userEquipment).where(eq(userEquipment.userId, userId));
}

// Workout Sessions
export async function getUserWorkoutSessions(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt))
    .limit(limit);
}

// Programs
export async function getWorkoutPrograms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workoutPrograms);
}

export async function getUserPrograms(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userPrograms).where(eq(userPrograms.userId, userId));
}

export async function createWorkoutSession(
  userId: number,
  workoutId: number,
  durationMinutes: number,
  exerciseLogs: Array<{
    workoutExerciseId: number;
    setsCompleted: number;
    repsCompleted?: number;
    weightUsed?: number;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(workoutSessions).values({
      userId,
      workoutId,
      startedAt: new Date(),
      completedAt: new Date(),
      durationMinutes,
    });

    const sessionId = (result[0] as any).insertId as number;

    if (exerciseLogs.length > 0) {
      await db.insert(sessionExerciseLogs).values(
        exerciseLogs.map(log => ({
          sessionId,
          workoutExerciseId: log.workoutExerciseId,
          setsCompleted: log.setsCompleted,
          repsCompleted: log.repsCompleted || null,
          weightUsed: log.weightUsed ? log.weightUsed.toString() : null,
        }))
      );
    }

    return { id: sessionId, userId, workoutId, durationMinutes };
  } catch (error) {
    console.error("[Database] Failed to create workout session:", error);
    throw error;
  }
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const sessions = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId));

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    // Calculate weekly frequency
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCount = sessions.filter(s => s.startedAt > oneWeekAgo).length;

    return {
      totalSessions,
      totalMinutes,
      weeklyFrequency: weeklyCount,
      averageSessionDuration: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get user stats:", error);
    return null;
  }
}

export async function getWorkoutHistory(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    return db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.startedAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get workout history:", error);
    return [];
  }
}
