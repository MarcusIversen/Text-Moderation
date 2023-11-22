DO $$ BEGIN
 CREATE TYPE "status_type" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "stepStatus_type" AS ENUM('pending', 'approved', 'rejected', 'previouslyRejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "step_type" AS ENUM('1: BadWord', '2: AIModeration', '3: ManualModeration');
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
	"userID" integer NOT NULL,
	"textInput" varchar NOT NULL,
	"status" "status_type" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"step" "step_type" NOT NULL,
	"badWordStep" "stepStatus_type" NOT NULL,
	"aiModerationStep" "stepStatus_type" NOT NULL,
	"manualModerationStep" "stepStatus_type" NOT NULL,
	"wordListScore" double precision NOT NULL,
	"personalIdentifiableInfoScore" double precision NOT NULL,
	"nsfwScore" double precision NOT NULL,
	"distilbertScore" double precision NOT NULL,
	CONSTRAINT "TextInput_ID_unique" UNIQUE("ID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"ID" serial NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
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
