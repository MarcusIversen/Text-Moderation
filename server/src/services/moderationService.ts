import postgres from "postgres";
import { CONNECTION_STRING } from "../config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { textInput } from "../db/schema";
import { eq } from "drizzle-orm";
import { getBadWordsFromInput, hasBadWords } from "../utils/utils";
import { TextInputInsertModel, TextInputSelectData } from "../dto/DTOs";

const sql = postgres(CONNECTION_STRING, { max: 1 });
const db = drizzle(sql);

export class ModerationService {
  /**
   * Method for initially creating standard TextInput and return result
   * @param userId
   * @param inputs
   */
  async createTextInput(
    userId: number,
    inputs: string,
  ): Promise<TextInputSelectData> {
    const insertModel: TextInputInsertModel = {
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
      distilbertScore: 0.0,
    };

    const result = await db
      .insert(textInput)
      .values(insertModel)
      .returning({
        textInput: textInput.textInput,
        id: textInput.id,
        userId: textInput.userId,
      });

    if (!result[0]?.textInput) {
      throw new Error("No result found");
    }

    return result[0];
  }

  /**
   * Method for checking bad words (step 1 in moderation)
   * @param textInputData
   */
  async badWordStep(textInputData: TextInputSelectData) {
    //TODO add a return type for type safety
    const containsBadWords = await hasBadWords(textInputData.textInput);
    const badWordsFound = await getBadWordsFromInput(textInputData.textInput);

    if (containsBadWords) {
      const wordScore = badWordsFound.length * 0.1;
      const response = await db
        .update(textInput)
        .set({
          status: "rejected",
          badWordStep: "rejected",
          aiModerationStep: "previouslyRejected",
          manualModerationStep: "previouslyRejected",
          updatedAt: new Date(),
          wordListScore: wordScore,
        })
        .where(
          eq(textInput.id, textInputData.id) &&
            eq(textInput.userId, textInputData.userId),
        )
        .returning({
          moderatedText: textInput.textInput,
          status: textInput.status,
        });
      return response[0];
    }

    return {
      ...textInputData,
      moderatedText: textInputData.textInput,
      status: "approved",
      badWordStep: "approved",
      aiModerationStep: "pending",
      manualModerationStep: "pending",
    };
  }
}
