import {serial, integer, timestamp, pgTable, varchar, pgEnum, bigint, doublePrecision} from "drizzle-orm/pg-core";

// User Table
export const user = pgTable("User", {
  id: serial("ID").unique(),
  username: varchar("username"),
  password: varchar("password"),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Status and Step Enums
export const statusType = pgEnum("status_type", ["pending", "approved", "rejected"]);
export const stepType = pgEnum("step_type", ["step1", "step2", "step3"]);

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
export const typeEnum = pgEnum("type_enum", ["badWord", "PersonalInfo", "negative", "nsfw", "hate", "threatening", "violence"]);

// Log Table
export const log = pgTable("Log", {
  id: serial("ID"),
  textInputId: integer("TextInputID").references(() => textInput.id),
  type: typeEnum("log_type"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});