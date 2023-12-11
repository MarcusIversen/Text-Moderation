import { textInput, textInputLog } from "../db/schema";

export interface UserDTO {
  id?: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type TextInputSelectModel = typeof textInput.$inferSelect; //Model for select via textInput Schema
export type TextInputInsertModel = typeof textInput.$inferInsert; //Model for insert via textInput Schema

export type TextInputUpdateModel = Pick<
  TextInputSelectModel,
  | "id"
  | "status"
  | "step"
  | "badWordStep"
  | "aiModerationStep"
  | "manualModerationStep"
  | "wordListScore"
  | "nsfwScore"
  | "distilbertScore"
  | "contactInfoScore"
>;

export type TextInputSelectData = Pick<
  TextInputSelectModel,
  "userId" | "textInput" | "id" | "createdAt"
>;

export type LogSelectModel = typeof textInputLog.$inferSelect; //Model for insert via textInput Schema
export type LogInsertModel = typeof textInputLog.$inferInsert; //Model for insert via textInput Schema

export type LogSelectData = Pick<
  LogSelectModel,
  "textInputId" | "moderationStep" | "id" | "createdAt"
>;
