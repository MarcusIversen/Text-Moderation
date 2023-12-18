import postgres from "postgres";
import {CONNECTION_STRING} from "../config/config";
import {drizzle} from "drizzle-orm/postgres-js";
import {textInput, textInputLog} from "../db/schema";
import {eq} from "drizzle-orm";
import {getBadWordsFromInput} from "../utils/utils";
import {
    LogInsertModel,
    LogSelectData,
    LogUpdateModel,
    TextInputInsertModel,
    TextInputSelectData,
    TextInputUpdateModel,
} from "../dto/DTOs";
import axios from "axios";

interface ScoreItem {
    label: string;
    score: number;
}

type ModerationResponse =
    | "approved"
    | "rejected"
    | "unclassifiable"
    | undefined;

interface AiModerationResponse {
    distilbertNegativeScore: number;
    nsfwScore: number;
    contactInfoScore: number;
    status: ModerationResponse;
}

const sql = postgres(CONNECTION_STRING, {max: 1});
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
            id: textInput.id,
            userId: textInput.userId,
            textInput: textInput.textInput,
            createdAt: textInput.createdAt,
        });

        if (!result[0]?.textInput) {
            throw new Error("No result found");
        }

        return result[0];
    }

    async createLog(
        textInputId: number,
        textInputStep: "1: BadWord" | "2: AIModeration" | "3: ManualModeration",
        moderationTags: string,
    ): Promise<LogSelectData> {
        const insertModel: LogInsertModel = {
            textInputId: textInputId,
            moderationStep: textInputStep,
            moderationTags: moderationTags,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.insert(textInputLog).values(insertModel).returning({
            id: textInputLog.id,
            textInputId: textInputLog.textInputId,
            moderationStep: textInputLog.moderationStep,
            createdAt: textInputLog.createdAt,
        });

        if (!result[0]?.textInputId) {
            throw new Error("No result found");
        }

        return result[0];
    }

    async getModerationInputsOnUser(userId: number) {
        try {
            return await db
                .select()
                .from(textInput)
                .where(eq(textInput.userId, userId))
                .execute();
        } catch (error) {
            console.error(
                `getModerationInputsOnUserError_moderationService: ${userId}:`, error);
            throw error;
        }
    }

    async getTextInputOnId(textInputId: number) {
        try {
            return await db
                .select()
                .from(textInput)
                .where(eq(textInput.id, textInputId))
                .execute();
        } catch (error) {
            console.error(`getTextInputOnIdError_moderationService:  ${textInputId}:`, error);
            throw error;
        }
    }


    /**
     * Method for updating TextInput
     */
    async updateTextInput(textInputData: TextInputUpdateModel) {
        const response = await db
            .update(textInput)
            .set({...textInputData, updatedAt: new Date()})
            .where(eq(textInput.id, textInputData.id))
            .returning({
                id: textInput.id,
                userId: textInput.userId,
                textInput: textInput.textInput,
            });

        return response[0];
    }

    /**
     * Method for updating Log
     */
    async updateLog(logData: LogUpdateModel) {
        const response = await db
            .update(textInputLog)
            .set({...logData, updatedAt: new Date()})
            .where(eq(textInputLog.textInputId, logData.textInputId))
            .returning({
                id: textInputLog.id,
                textInputId: textInputLog.textInputId,
                moderationStep: textInputLog.moderationStep,
            });

        return response[0];
    }

    /**
     * Method for checking bad words (step 1 in moderation)
     * @param textInputData
     */
    async badWords(textInputData: TextInputSelectData): Promise<string[]> {
        return await getBadWordsFromInput(textInputData.textInput);
    }

    async distilbert(textInput: string) {
        const url = "http://localhost:3000/api/ai/distilbert";
        const data = {inputs: textInput};

        try {
            const response = await axios.post(url, data);
            return response.data[0];
        } catch (error) {
            console.log("distilbertError_moderationService: ", error);
            throw error;
        }
    }

    async nsfw(textInput: string) {
        const url = "http://localhost:3000/api/ai/nsfw";
        const data = {inputs: textInput};

        try {
            const response = await axios.post(url, data);
            return response.data[0];
        } catch (error) {
            console.log("nsfwError_moderationService: ", error);
            throw error;
        }
    }

    async contactInfo(textInput: string) {
        const url = "http://localhost:3000/api/ai/contactInfo";
        const data = {inputs: textInput};

        try {
            const response = await axios.post(url, data);
            return response.data[0];
        } catch (error) {
            console.log("contactInfoError_moderationService: ", error);
            throw error;
        }
    }

    async moderation(textInput: string) {
        const url = "http://localhost:3000/api/ai/moderation"; // replace with your server's URL and port
        const data = {inputs: textInput};

        try {
            const response = await axios.post(url, data);
            return response.data[0];
        } catch (error) {
            console.log("moderationError_moderationService: ", error);
            throw error;
        }
    }


    async aiModeration(
        textInputData: TextInputSelectData,
    ): Promise<AiModerationResponse | undefined> {
        if (!textInputData || typeof textInputData.textInput !== "string") {
            throw new Error("Invalid textInputData");
        }

        try {
            const [distilbert, nsfw, contactInfo] = await Promise.all([
                this.distilbert(textInputData.textInput),
                this.nsfw(textInputData.textInput),
                this.contactInfo(textInputData.textInput),
            ]);

            const distilbertPositiveScore = distilbert.find(
                (item: ScoreItem) => item.label === "POSITIVE",
            )?.score;
            const distilbertNegativeScore = distilbert.find(
                (item: ScoreItem) => item.label === "NEGATIVE",
            )?.score;
            const sfwScore = nsfw.find((item: ScoreItem) => item.label === "SFW")
                ?.score;
            const nsfwScore = nsfw.find((item: ScoreItem) => item.label === "NSFW")
                ?.score;
            const contactInfoOtherScore = contactInfo.find(
                (item: ScoreItem) => item.label === "Other",
            )?.score;
            const contactInfoScore = contactInfo.find(
                (item: ScoreItem) => item.label === "Privacy contact information",
            )?.score;

            if (
                !distilbertPositiveScore ||
                !distilbertNegativeScore ||
                !sfwScore ||
                !nsfwScore ||
                !contactInfoOtherScore ||
                !contactInfoScore
            ) {
                return undefined;
            }

            if (distilbertNegativeScore > 0.9 && nsfwScore > 0.9 || nsfwScore > 0.99 || contactInfoScore > 0.9) {
                return {
                    distilbertNegativeScore: distilbertNegativeScore,
                    nsfwScore: nsfwScore,
                    contactInfoScore: contactInfoScore,
                    status: "rejected",
                };
            }

            if ((nsfw > 0.99 && distilbertNegativeScore <= 0.2)) {
                return {
                    distilbertNegativeScore: distilbertNegativeScore,
                    nsfwScore: nsfwScore,
                    contactInfoScore: contactInfoScore,
                    status: "unclassifiable",
                };
            }

            if (distilbertNegativeScore > 0.99 && nsfwScore < 0.8) {
                return {
                    distilbertNegativeScore: distilbertNegativeScore,
                    nsfwScore: nsfwScore,
                    contactInfoScore: contactInfoScore,
                    status: "unclassifiable",
                };
            }


            if (
                (distilbertNegativeScore >= 0.5 && distilbertNegativeScore < 0.9) ||
                (nsfwScore >= 0.5 && nsfwScore < 0.9) ||
                (nsfwScore >= 0.5 && nsfwScore < 0.9) && (contactInfoScore >= 0.5 && contactInfoScore < 0.9)
            ) {
                return {
                    distilbertNegativeScore: distilbertNegativeScore,
                    nsfwScore: nsfwScore,
                    contactInfoScore: contactInfoScore,
                    status: "unclassifiable",
                };
            }

            if (distilbertPositiveScore > 0.9 && sfwScore > 0.9 || contactInfoOtherScore > 0.9) {
                return {
                    distilbertNegativeScore: distilbertNegativeScore,
                    nsfwScore: nsfwScore,
                    contactInfoScore: contactInfoScore,
                    status: "approved",
                };
            }

        } catch (error) {
            console.log("AiModeration_ModerationService: ", error);
            throw error;
        }
    }

    async getModerationTags(textInputData: TextInputSelectData): Promise<string> {
        const moderation = await this.moderation(textInputData.textInput);

        const labelScores: { [key: string]: number | undefined } = {
            OK: moderation.find((item: ScoreItem) => item.label === "OK")?.score,
            sexual: moderation.find((item: ScoreItem) => item.label === "S")?.score,
            hate: moderation.find((item: ScoreItem) => item.label === "H")?.score,
            violence: moderation.find((item: ScoreItem) => item.label === "V")?.score,
            harassment: moderation.find((item: ScoreItem) => item.label === "HR")
                ?.score,
            selfHarm: moderation.find((item: ScoreItem) => item.label === "SH")
                ?.score,
            sexualMinor: moderation.find((item: ScoreItem) => item.label === "S3")
                ?.score,
            hateThreatening: moderation.find((item: ScoreItem) => item.label === "H2")
                ?.score,
            violenceGraphic: moderation.find((item: ScoreItem) => item.label === "V2")
                ?.score,

        };

        const highScoreLabels: string[] = [];

        for (const label in labelScores) {
            if (labelScores[label]! > 0.15) {
                highScoreLabels.push(label);
            }
        }

        return highScoreLabels.join(", ");
    }

    // async manualModerationStep(textInputData: string) {
    //   // TODO make the logic for manually approving or rejecting and maybe in the future - reason for rejection
    // }
}
