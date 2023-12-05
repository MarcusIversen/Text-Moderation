import postgres from "postgres";
import { CONNECTION_STRING } from "../config/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { textInput } from "../db/schema";
import { eq } from "drizzle-orm";
import { getBadWordsFromInput, hasBadWords } from "../utils/utils";
import { TextInputInsertModel, TextInputSelectData } from "../dto/DTOs";
import axios from "axios";

interface ScoreItem {
  label: string;
  score: number;
}

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
      contactInfoScore: 0.0,
      nsfwScore: 0.0,
      distilbertScore: 0.0,
    };

    const result = await db.insert(textInput).values(insertModel).returning({
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
        .where(eq(textInput.id, textInputData.id))
        .returning({
          moderatedText: textInput.textInput,
          status: textInput.status,
        });

      return {
        ...textInputData,
        moderatedText: response[0]?.moderatedText,
        status: response[0]?.status,
        badWordStep: "approved",
        aiModerationStep: "pending",
        manualModerationStep: "pending",
      };
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

  async distilbert(textInput: string) {
    const url = "http://localhost:3000/api/ai/distilbert";
    const data = { inputs: textInput };

    try {
      const response = await axios.post(url, data);
      return response.data[0];
    } catch (error) {
      console.error(`Error in distilbertStep: ${error}`);
      throw error;
    }
  }

  async nsfw(textInput: string) {
    const url = "http://localhost:3000/api/ai/nsfw";
    const data = { inputs: textInput };

    try {
      const response = await axios.post(url, data);
      return response.data[0];
    } catch (error) {
      console.error(`Error in nsfwStep: ${error}`);
      throw error;
    }
  }

  async contactInfo(textInput: string) {
    const url = "http://localhost:3000/api/ai/contactInfo";
    const data = { inputs: textInput };

    try {
      const response = await axios.post(url, data);
      return response.data[0];
    } catch (error) {
      console.error(`Error in contactInfoStep: ${error}`);
      throw error;
    }
  }

  // async moderation(textInput: string) {
  //   const url = 'http://localhost:3000/api/ai/moderation';  // replace with your server's URL and port
  //   const data = { inputs: textInput };
  //
  //   try {
  //     const response = await axios.post(url, data);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error in aiModerationStep: ${error}`);
  //     throw error;
  //   }
  // }

  async aiModerationStep(textInputData: TextInputSelectData) {
    if (!textInputData || typeof textInputData.textInput !== "string") {
      throw new Error("Invalid textInputData");
    }

    try {
      const [distilbert, nsfw, contactInfo] = await Promise.all([
        this.distilbert(textInputData.textInput),
        this.nsfw(textInputData.textInput),
        this.contactInfo(textInputData.textInput),
      ]);

      let distilbertPositiveScore: number | undefined;
      let distilbertNegativeScore: number | undefined;

      distilbert.forEach((item: ScoreItem) => {
        if (item.label === "POSITIVE") {
          distilbertPositiveScore = item.score;
        }
        if (item.label === "NEGATIVE") {
          distilbertNegativeScore = item.score;
        }
      });

      let nsfwScore: number | undefined;
      let sfwScore: number | undefined;

      nsfw.forEach((item: ScoreItem) => {
        if (item.label === "SFW") {
          sfwScore = item.score;
        }
        if (item.label === "NSFW") {
          nsfwScore = item.score;
        }
      });

      let contactInfoScore: number | undefined;
      let contactInfoOtherScore: number | undefined;

      contactInfo.forEach((item: ScoreItem) => {
        if (item.label === "Privacy contact information") {
          contactInfoScore = item.score;
        }
        if (item.label === "Other") {
          contactInfoOtherScore = item.score;
        }
      });

      console.log({ distilbertPositiveScore });
      console.log({ distilbertNegativeScore });
      console.log({ nsfwScore });
      console.log({ sfwScore });
      console.log({ contactInfoScore });
      console.log({ contactInfoOtherScore });

      if (
        !distilbertNegativeScore ||
        !nsfwScore ||
        !contactInfoScore ||
        !distilbertPositiveScore ||
        !sfwScore ||
        !contactInfoOtherScore
      ) {
        return;
      }

      switch (true) {
        case distilbertNegativeScore > 0.9 ||
          nsfwScore > 0.9 ||
          contactInfoScore > 0.9: {
          const rejectedResponse = await db
            .update(textInput)
            .set({
              step: "2: AIModeration",
              status: "rejected",
              badWordStep: "approved",
              aiModerationStep: "rejected",
              manualModerationStep: "previouslyRejected",
              updatedAt: new Date(),
              distilbertScore: distilbertNegativeScore,
              nsfwScore: nsfwScore,
              contactInfoScore: contactInfoScore,
            })
            .where(eq(textInput.id, textInputData.id))
            .returning({
              moderatedText: textInput.textInput,
              status: textInput.aiModerationStep,
            });

          return {
            ...textInputData,
            moderatedText: rejectedResponse[0]?.moderatedText,
            status: rejectedResponse[0]?.status,
            aiModerationStep: "rejected",
            manualModerationStep: "previouslyRejected",
          };
        }

        case distilbertPositiveScore > 0.9 ||
          sfwScore > 0.9 ||
          contactInfoOtherScore > 0.9: {
          const approvedResponse = await db
            .update(textInput)
            .set({
              step: "3: ManualModeration",
              status: "pending",
              badWordStep: "approved",
              aiModerationStep: "approved",
              manualModerationStep: "pending",
              updatedAt: new Date(),
              distilbertScore: distilbertNegativeScore,
              nsfwScore: nsfwScore,
              contactInfoScore: contactInfoScore,
            })
            .where(eq(textInput.id, textInputData.id))
            .returning({
              moderatedText: textInput.textInput,
              status: textInput.aiModerationStep,
            });

          return {
            ...textInputData,
            moderatedText: approvedResponse[0]?.moderatedText,
            status: approvedResponse[0]?.status,
            aiModerationStep: "approved",
            manualModerationStep: "pending",
          };
        }

        case (distilbertNegativeScore >= 0.5 &&
          distilbertNegativeScore < 0.9) ||
          (nsfwScore >= 0.5 && nsfwScore < 0.9) ||
          (contactInfoScore >= 0.5 && contactInfoScore < 0.9): {
          const unclassifiableResponse = await db
            .update(textInput)
            .set({
              step: "3: ManualModeration",
              status: "pending",
              badWordStep: "approved",
              aiModerationStep: "unclassifiable",
              manualModerationStep: "pending",
              updatedAt: new Date(),
              distilbertScore: distilbertNegativeScore,
              nsfwScore: nsfwScore,
              contactInfoScore: contactInfoScore,
            })
            .where(eq(textInput.id, textInputData.id))
            .returning({
              moderatedText: textInput.textInput,
              status: textInput.aiModerationStep,
            });

          return {
            ...textInputData,
            moderatedText: unclassifiableResponse[0]?.moderatedText,
            status: unclassifiableResponse[0]?.status,
            aiModerationStep: "unclassifiable",
            manualModerationStep: "pending",
          };
        }

        default: {
          const defaultResponse = await db
            .update(textInput)
            .set({
              step: "2: AIModeration",
              status: "rejected",
              badWordStep: "approved",
              aiModerationStep: "rejected",
              manualModerationStep: "previouslyRejected",
              updatedAt: new Date(),
              distilbertScore: distilbertNegativeScore,
              nsfwScore: nsfwScore,
              contactInfoScore: contactInfoScore,
            })
            .where(eq(textInput.id, textInputData.id))
            .returning({
              moderatedText: textInput.textInput,
              status: textInput.aiModerationStep,
            });

          return {
            ...textInputData,
            moderatedText: defaultResponse[0]?.moderatedText,
            status: defaultResponse[0]?.status,
            aiModerationStep: "rejected",
            manualModerationStep: "previouslyRejected",
          };
        }
      }
    } catch (error) {
      console.error(`Error in aiModerationStep: ${error}`);
      throw error;
    }
  }

  // async manualModerationStep(textInputData: string) {
  //   // TODO make the logic for manually approving or rejecting and maybe in the future - reason for rejection
  // }
}
