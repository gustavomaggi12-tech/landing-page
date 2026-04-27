CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`instructions` text,
	`muscleGroup` varchar(100) NOT NULL,
	`equipmentType` varchar(100) NOT NULL,
	`exerciseType` enum('strength','cardio','mobility') NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`imageUrl` text,
	`videoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programWorkouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`workoutId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`weekNumber` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `programWorkouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessionExerciseLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`workoutExerciseId` int NOT NULL,
	`setsCompleted` int NOT NULL,
	`repsCompleted` int,
	`weightUsed` decimal(5,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessionExerciseLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userEquipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`equipmentType` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userEquipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPrograms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`programId` int NOT NULL,
	`startedAt` timestamp NOT NULL,
	`completedAt` timestamp,
	`currentWeek` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userPrograms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutExercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workoutId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`sets` int NOT NULL,
	`reps` int,
	`weight` decimal(5,2),
	`restSeconds` int NOT NULL DEFAULT 60,
	`notes` text,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workoutExercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutPrograms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`programType` enum('fullbody','upperlower','ppl','custom') NOT NULL,
	`durationWeeks` int,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workoutPrograms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workoutId` int NOT NULL,
	`startedAt` timestamp NOT NULL,
	`completedAt` timestamp,
	`durationMinutes` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workoutSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isTemplate` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `programWorkouts` ADD CONSTRAINT `programWorkouts_programId_workoutPrograms_id_fk` FOREIGN KEY (`programId`) REFERENCES `workoutPrograms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `programWorkouts` ADD CONSTRAINT `programWorkouts_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessionExerciseLogs` ADD CONSTRAINT `sessionExerciseLogs_sessionId_workoutSessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `workoutSessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessionExerciseLogs` ADD CONSTRAINT `sessionExerciseLogs_workoutExerciseId_workoutExercises_id_fk` FOREIGN KEY (`workoutExerciseId`) REFERENCES `workoutExercises`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userEquipment` ADD CONSTRAINT `userEquipment_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userPrograms` ADD CONSTRAINT `userPrograms_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userPrograms` ADD CONSTRAINT `userPrograms_programId_workoutPrograms_id_fk` FOREIGN KEY (`programId`) REFERENCES `workoutPrograms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workoutExercises` ADD CONSTRAINT `workoutExercises_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workoutExercises` ADD CONSTRAINT `workoutExercises_exerciseId_exercises_id_fk` FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workoutSessions` ADD CONSTRAINT `workoutSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workoutSessions` ADD CONSTRAINT `workoutSessions_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;