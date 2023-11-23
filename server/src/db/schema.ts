import {serial, integer, timestamp, pgTable, varchar, pgEnum, doublePrecision} from "drizzle-orm/pg-core";


// User Table
export const user = pgTable("User", {
  id: serial("ID").unique(),
  username: varchar("username").notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull(),
  firstName: varchar("firstName").notNull(),
  lastName: varchar("lastName").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

// Status and Step Enums
export const statusType = pgEnum("status_type", ["pending", "approved", "rejected", "unclassifiable"]);
export const stepType = pgEnum("step_type", ["1: BadWord", "2: AIModeration", "3: ManualModeration"] );
export const stepStatusType = pgEnum("stepStatus_type", ["pending", "approved", "rejected", "previouslyRejected"])

// TextInput Table
export const textInput = pgTable("TextInput", {
  id: serial("ID").unique(),
  userId: integer("userID").references(() => user.id).notNull(),
  textInput: varchar("textInput").notNull(),
  status: statusType("status").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  step: stepType("step").notNull(),
  badWordStep: stepStatusType("badWordStep").notNull(),
  aiModerationStep: stepStatusType("aiModerationStep").notNull(),
  manualModerationStep: stepStatusType("manualModerationStep").notNull(),
  wordListScore: doublePrecision("wordListScore").notNull(),
  personalIdentifiableInfoScore: doublePrecision("personalIdentifiableInfoScore").notNull(),
  nsfwScore: doublePrecision("nsfwScore").notNull(),
  distilbertScore: doublePrecision("distilbertScore").notNull(),
});

// Type Enum
export const typeEnum = pgEnum("type_enum", ["badWord", "AI", "Manual"]);

export const  moderationTypeEnum= pgEnum("moderation_type_enum", ["badWord", "negative", "nsfw", "sexual", "hate", "violence", "harassment", "harassment", "sexual/minors", "hate/threatening", "violence/graphic", "personalInfo" ]);

// Log Table
export const log = pgTable("Log", {
  id: serial("ID").unique(),
  textInputId: integer("TextInputID").references(() => textInput.id).notNull(),
  type: typeEnum("log_type").notNull(),
  moderationTags: moderationTypeEnum("moderation_type").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});