import {Request, Response} from "express";
import {ModerationService} from "../services/moderationService";
import {getBadWordsList} from "../utils/utils";

export class ModerationController {
    private moderationService: ModerationService;

    constructor(moderationService: ModerationService) {
        this.moderationService = moderationService;
    }


    async processTextInput(req: Request, res: Response): Promise<Response | undefined> {
        const {userId, content} = req.body as { userId: number; content: string };

        if (!content) {
            return res.status(400).json({
                error: "Invalid or missing input parameter",
                status: "invalid"
            });
        }

        const textData = await this.moderationService.createTextInput(
            userId,
            content,
        );

        const badWords = await this.moderationService.badWords(textData);


        try {
            if (badWords.length > 0) {
                await this.moderationService.createLog(
                    textData.id,
                    "1: BadWord",
                    "Bad words found: " + badWords.join(", " + "\n"),
                );
                await this.moderationService.updateTextInput({
                    id: textData.id,
                    status: "rejected",
                    step: "1: BadWord",
                    badWordStep: "rejected",
                    aiModerationStep: "previouslyRejected",
                    manualModerationStep: "previouslyRejected",
                    wordListScore: badWords.length * 0.1,
                    nsfwScore: 0,
                    distilbertScore: 0,
                    contactInfoScore: 0,
                });
                return res.status(200).json({
                    message: "Text rejected due to bad words",
                    status: "rejected",
                    step: "BadWords",
                    textInput: textData.textInput,
                    userId: userId,
                    id: textData.id,
                });
            }

            const aiModeration = await this.moderationService.aiModeration(textData);


            if (aiModeration?.status === "rejected") {
                const moderationTags = await this.moderationService.getModerationTags(textData);

                if(aiModeration?.contactInfoScore > 0.9){
                    await this.moderationService.createLog(
                        textData.id,
                        "2: AIModeration",
                        moderationTags + ", " + "Personal information detected",
                    );
                }else if(aiModeration?.contactInfoScore < 0.9){
                    await this.moderationService.createLog(
                        textData.id,
                        "2: AIModeration",
                        moderationTags,
                    );
                }

                await this.moderationService.updateTextInput({
                    id: textData.id,
                    status: "rejected",
                    step: "2: AIModeration",
                    badWordStep: "approved",
                    aiModerationStep: "rejected",
                    manualModerationStep: "previouslyRejected",
                    wordListScore: 0,
                    nsfwScore: aiModeration.nsfwScore,
                    distilbertScore: aiModeration.distilbertNegativeScore,
                    contactInfoScore: aiModeration.contactInfoScore,
                });
                return res.status(200).json({
                    message: "Text input has been rejected by AI Moderation",
                    status: "rejected",
                    step: "AI",
                    textInput: textData.textInput,
                    userId: userId,
                    id: textData.id,
                });
            }


            if (aiModeration?.status === "approved") {
                await this.moderationService.updateTextInput({
                    id: textData.id,
                    status: "approved",
                    step: "2: AIModeration",
                    badWordStep: "approved",
                    aiModerationStep: "approved",
                    manualModerationStep: "approved",
                    wordListScore: 0,
                    nsfwScore: aiModeration.nsfwScore,
                    distilbertScore: aiModeration.distilbertNegativeScore,
                    contactInfoScore: aiModeration.contactInfoScore,
                });
                await this.moderationService.createLog(
                    textData.id,
                    "2: AIModeration",
                    "OK",
                );
                return res.status(200).json({
                    message: "Text input has been approved by AI Moderation",
                    status: "approved",
                    step: "AI",
                    textInput: textData.textInput,
                    userId: userId,
                    id: textData.id,
                });
            }

            if (aiModeration?.status === "unclassifiable") {
                await this.moderationService.updateTextInput({
                    id: textData.id,
                    status: "pending",
                    step: "3: ManualModeration",
                    badWordStep: "approved",
                    aiModerationStep: "unclassifiable",
                    manualModerationStep: "pending",
                    wordListScore: 0,
                    nsfwScore: aiModeration.nsfwScore,
                    distilbertScore: aiModeration.distilbertNegativeScore,
                    contactInfoScore: aiModeration.contactInfoScore,
                });
                await this.moderationService.createLog(
                    textData.id,
                    "2: AIModeration",
                    "Unclassifiable",
                );
                return res.status(200).json({
                    message: "Text is unclassifiable and pending manual moderation",
                    status: "unclassifiable",
                    step: "AI",
                    textInput: textData.textInput,
                    userId: userId,
                    id: textData.id,
                });
            }

        } catch (error) {
            return res.status(500).json({error: error, textInputId: textData.id});
        }
    }

    async getTextLogOnId(req: Request, res: Response) {
        const { textInputId } = req.params;

        if(!textInputId) {
            return undefined;
        }

        const textLog = await this.moderationService.getTextLogOnId(parseInt(textInputId, 10));

        if (!textLog) {
            return res.status(404).json({ error: "Text input not found" });
        }

        return res.json(textLog);
    }

    async approveTextInput(req: Request, res: Response) {
        const { textInputId } = req.params;
        const { moderationTags } = req.body;


        if(!textInputId) {
            return undefined;
        }

        const textInput = await this.moderationService.getTextInputOnId(parseInt(textInputId, 10));

        if (!textInput) {
            return res.status(404).json({ error: "Text input not found" });
        }

        await this.moderationService.updateTextInput({
            id: parseInt(textInputId, 10),
            status: "approved",
            step: "3: ManualModeration",
            badWordStep: "approved",
            aiModerationStep: "unclassifiable",
            manualModerationStep: "approved",
            wordListScore: textInput[0]?.wordListScore ?? 0,
            nsfwScore: textInput[0]?.nsfwScore ?? 0,
            distilbertScore: textInput[0]?.distilbertScore ?? 0,
            contactInfoScore: textInput[0]?.contactInfoScore ?? 0,
        });

        await this.moderationService.updateLog({
            textInputId: textInput[0]?.id ?? 0,
            moderationStep: "3: ManualModeration",
            moderationTags: `Approved: ${moderationTags}`
        })

        return res.json({ message: `Text input manually approved with following moderationTags: "${moderationTags}"` });
    }

    async rejectTextInput(req: Request, res: Response) {
        const { textInputId } = req.params;
        const { moderationTags } = req.body;

        if(!textInputId) {
            return undefined;
        }

        const textInput = await this.moderationService.getTextInputOnId(parseInt(textInputId, 10));

        if (!textInput) {
            return res.status(404).json({ error: "Text input not found" });
        }

        await this.moderationService.updateTextInput({
            id: textInput[0]?.id ?? 0,
            status: "rejected",
            step: "3: ManualModeration",
            badWordStep: "approved",
            aiModerationStep: "unclassifiable",
            manualModerationStep: "rejected",
            wordListScore: textInput[0]?.wordListScore ?? 0,
            nsfwScore: textInput[0]?.nsfwScore ?? 0,
            distilbertScore: textInput[0]?.distilbertScore ?? 0,
            contactInfoScore: textInput[0]?.contactInfoScore ?? 0,
        });

        await this.moderationService.updateLog({
            textInputId: textInput[0]?.id ?? 0,
            moderationStep: "3: ManualModeration",
            moderationTags: `Rejected: ${moderationTags}`
        })

        return res.json({ message: `Text input manually rejected with following moderationTags: "${moderationTags}"` });
    }

    async deleteTextInput(req: Request, res: Response) {
        const { textInputId } = req.params;

        if(!textInputId) {
            return undefined;
        }

        await this.moderationService.deleteTextInput(parseInt(textInputId, 10));

        return res.json({ message: `Text input with id ${textInputId} has been deleted` });
    }


    async getBadWordsList(req: Request, res: Response) {
        const badWordsList = getBadWordsList();
        return res.json({badWordsList});
    }

    async getModerationInputsOnUser(req: Request, res: Response) {
        const {userID} = req.params;

        try {
            const moderationOnUser =
                await this.moderationService.getModerationInputsOnUser(
                    parseInt(userID ?? "0", 10),
                );

            if (!moderationOnUser) {
                return res.status(404).json({error: "User not found"});
            }

            res.json(moderationOnUser);
        } catch (error) {
            return res.status(500).send("Internal backend error");
        }
    }

    async getTextInputOnId(req: Request, res: Response) {
        const {textInputId} = req.params;

        try {
            const textInput =
                await this.moderationService.getTextInputOnId(
                    parseInt(textInputId ?? "0", 10),
                );

            if (!textInput) {
                return res.status(404).json({error: "User not found"});
            }

            res.json(textInput);
        } catch (error) {
            return res.status(500).send("Internal backend error");
        }
    }
}
