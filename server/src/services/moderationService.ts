import path from "path";
import fs from "fs";
import postgres from "postgres";
import {CONNECTION_STRING} from "../config/config";
import {drizzle} from "drizzle-orm/postgres-js";
import {textInput, user} from "../db/schema";
import {response} from "express";
import {eq} from "drizzle-orm";
import {getBadWordsFromInput, hasBadWords} from "../utils/utils";

const sql = postgres(CONNECTION_STRING, {max: 1})
const db = drizzle(sql);

export class ModerationService {

  /**
   * Method for initially creating standard TextInput and return result
   * @param userId
   * @param inputs
   */
  async createTextInput(userId: number, inputs: string) {
    const result = await db
        .insert(textInput)
        .values({
          userId: userId,
          textInput: inputs,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
          step: "1: BadWord",
          badWordStep: "pending",
          aiModerationStep: "pending",
          manualModerationStep: "pending",
          wordListScore: 0.0,
          personalIdentifiableInfoScore: 0.0,
          nsfwScore: 0.0,
          distilbertScore: 0.0
        })
        .returning({createdText: textInput.textInput, textInputId: textInput.id, userId: textInput.userId});

    if(!result[0]?.createdText){
      return;
    }

    return result[0];
  }

  /**
   * Method for checking bad words (step 1 in moderation)
   * @param textInputData
   */
  async badWordStep(textInputData: any) {
    const containsBadWords = await hasBadWords( textInputData.createdText);
    const badWordsFound = await getBadWordsFromInput(textInputData.createdText);

    if (containsBadWords) {
      const wordScore = badWordsFound.length * 0.1;
      const response = await db.update(textInput)
          .set({
            status: "rejected",
            badWordStep: "rejected",
            aiModerationStep: "previouslyRejected",
            manualModerationStep: "previouslyRejected",
            updatedAt: new Date(),
            wordListScore: wordScore
          })
          .where(eq(textInput.id, textInputData.textInputId) && eq(textInput.userId, textInputData.userId))
          .returning({moderatedText: textInput.textInput, status: textInput.status})
      return response[0];
    }

    return {
      ...textInputData,
      moderatedText: textInputData.createdText,
      status: 'approved',
      badWordStep: "approved",
      aiModerationStep: "pending",
      manualModerationStep: "pending",};
  }

  async aiModerationStep(textInputData: any) {
    // TODO make the logic for (approved, rejected and maybe ambigousData) and implement this step
  }

  async manualModerationStep(textInputData: any) {
    // TODO make the logic for manually approving or rejecting and maybe in the future - reason for rejection
  }


}
