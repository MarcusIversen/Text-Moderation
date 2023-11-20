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
export const statusType = pgEnum("status_type", ["pending", "approved", "rejected"]);
export const stepType = pgEnum("step_type", ["BadWord", "AIModeration", "ManualModeration"]);

// TextInput Table
export const textInput = pgTable("TextInput", {
  id: serial("ID").unique(),
  userId: integer("userID").references(() => user.id),
  content: varchar("content"),
  status: statusType("status"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  step: stepType("step"),
  wordListScore: doublePrecision("wordListScore"),
  personalIdentifiableInfoScore: doublePrecision("personalIdentifiableInfoScore"),
  nsfwScore: doublePrecision("nsfwScore"),
  distilbertScore: doublePrecision("distilbertScore"),
});

// Type Enum
export const typeEnum = pgEnum("type_enum", ["badWord", "PersonalInfo", "negative", "nsfw", "hate", "threatening", "violence", "racism"]);

// Log Table
export const log = pgTable("Log", {
  id: serial("ID"),
  textInputId: integer("TextInputID").references(() => textInput.id),
  type: typeEnum("log_type"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});