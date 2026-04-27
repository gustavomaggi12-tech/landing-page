import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean, foreignKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  muscleGroup: varchar("muscleGroup", { length: 100 }).notNull(), // e.g., "chest", "back", "legs"
  equipmentType: varchar("equipmentType", { length: 100 }).notNull(), // e.g., "dumbbell", "barbell", "bodyweight"
  exerciseType: mysqlEnum("exerciseType", ["strength", "cardio", "mobility"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  imageUrl: text("imageUrl"),
  videoUrl: text("videoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

export const workouts = mysqlTable("workouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isTemplate: boolean("isTemplate").default(false).notNull(), // true for pre-defined programs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
]));

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

export const workoutExercises = mysqlTable("workoutExercises", {
  id: int("id").autoincrement().primaryKey(),
  workoutId: int("workoutId").notNull(),
  exerciseId: int("exerciseId").notNull(),
  sets: int("sets").notNull(),
  reps: int("reps"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  restSeconds: int("restSeconds").default(60).notNull(),
  notes: text("notes"),
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.workoutId],
    foreignColumns: [workouts.id],
  }),
  foreignKey({
    columns: [table.exerciseId],
    foreignColumns: [exercises.id],
  }),
]));

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = typeof workoutExercises.$inferInsert;

export const workoutSessions = mysqlTable("workoutSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workoutId: int("workoutId").notNull(),
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
  durationMinutes: int("durationMinutes"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
  foreignKey({
    columns: [table.workoutId],
    foreignColumns: [workouts.id],
  }),
]));

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = typeof workoutSessions.$inferInsert;

export const sessionExerciseLogs = mysqlTable("sessionExerciseLogs", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  workoutExerciseId: int("workoutExerciseId").notNull(),
  setsCompleted: int("setsCompleted").notNull(),
  repsCompleted: int("repsCompleted"),
  weightUsed: decimal("weightUsed", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.sessionId],
    foreignColumns: [workoutSessions.id],
  }),
  foreignKey({
    columns: [table.workoutExerciseId],
    foreignColumns: [workoutExercises.id],
  }),
]));

export type SessionExerciseLog = typeof sessionExerciseLogs.$inferSelect;
export type InsertSessionExerciseLog = typeof sessionExerciseLogs.$inferInsert;

export const userEquipment = mysqlTable("userEquipment", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  equipmentType: varchar("equipmentType", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
]));

export type UserEquipment = typeof userEquipment.$inferSelect;
export type InsertUserEquipment = typeof userEquipment.$inferInsert;

export const workoutPrograms = mysqlTable("workoutPrograms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  programType: mysqlEnum("programType", ["fullbody", "upperlower", "ppl", "custom"]).notNull(),
  durationWeeks: int("durationWeeks"),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkoutProgram = typeof workoutPrograms.$inferSelect;
export type InsertWorkoutProgram = typeof workoutPrograms.$inferInsert;

export const programWorkouts = mysqlTable("programWorkouts", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull(),
  workoutId: int("workoutId").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0-6, 0 = Sunday
  weekNumber: int("weekNumber").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.programId],
    foreignColumns: [workoutPrograms.id],
  }),
  foreignKey({
    columns: [table.workoutId],
    foreignColumns: [workouts.id],
  }),
]));

export type ProgramWorkout = typeof programWorkouts.$inferSelect;
export type InsertProgramWorkout = typeof programWorkouts.$inferInsert;

export const userPrograms = mysqlTable("userPrograms", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  programId: int("programId").notNull(),
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
  currentWeek: int("currentWeek").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
  foreignKey({
    columns: [table.programId],
    foreignColumns: [workoutPrograms.id],
  }),
]));

export type UserProgram = typeof userPrograms.$inferSelect;
export type InsertUserProgram = typeof userPrograms.$inferInsert;