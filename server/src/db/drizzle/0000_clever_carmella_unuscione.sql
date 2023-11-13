DO $$ BEGIN
 CREATE TYPE "status_type" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "step_type" AS ENUM('BadWord', 'AIModeration', 'ManualModeration');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "type_enum" AS ENUM('badWord', 'PersonalInfo', 'negative', 'nsfw', 'hate', 'threatening', 'violence', 'racism');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Log" (
	"ID" serial NOT NULL,
	"TextInputID" integer,
	"log_type" "type_enum",
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TextInput" (
	"ID" serial NOT NULL,
	"userID" integer,
	"content" varchar,
	"status" "status_type",
	"created_at" timestamp,
	"updated_at" timestamp,
	"step" "step_type",
	"wordListScore" double precision,
	"personalIdentifiableInfoScore" double precision,
	"nsfwScore" double precision,
	"distilbertScore" double precision,
	CONSTRAINT "TextInput_ID_unique" UNIQUE("ID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"ID" serial NOT NULL,
	"username" varchar,
	"password" varchar,
	"firstName" varchar,
	"lastName" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "User_ID_unique" UNIQUE("ID")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Log" ADD CONSTRAINT "Log_TextInputID_TextInput_ID_fk" FOREIGN KEY ("TextInputID") REFERENCES "TextInput"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TextInput" ADD CONSTRAINT "TextInput_userID_User_ID_fk" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
