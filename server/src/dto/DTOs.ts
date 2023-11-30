import { textInput } from "../db/schema";

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

export type TextInputSelectData = Pick<
  TextInputSelectModel,
  "userId" | "textInput" | "id"
>;

export interface LogDTO {
  id?: number;
  textInputId: number;
  type?:
    | "badWord"
    | "PersonalInfo"
    | "negative"
    | "nsfw"
    | "hate"
    | "threatening"
    | "violence"
    | "racism";
  createdAt?: Date;
  updatedAt?: Date;
}
