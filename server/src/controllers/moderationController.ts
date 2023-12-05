import { Request, Response } from "express";
import { ModerationService } from "../services/moderationService";
import {
  getBadWordsFromInput,
  getBadWordsList,
  hasBadWords,
} from "../utils/utils";

export class ModerationController {
  private moderationService: ModerationService;

  constructor(moderationService: ModerationService) {
    this.moderationService = moderationService;
  }

  async processTextInput(req: Request, res: Response): Promise<void> {
    const { userId, content } = req.body as { userId: number; content: string };

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "Invalid or missing input parameter" });
      return;
    }

    try {
      const textData = await this.moderationService.createTextInput(
        userId,
        content,
      );

      const moderationResult =
        await this.moderationService.badWordStep(textData);
      if (moderationResult?.status === "rejected") {
        res.status(400).json({
          message: "Text rejected due to bad words",
          textInput: moderationResult.moderatedText,
          userId: userId,
        });
        return;
      }

      const aiResult =
        await this.moderationService.aiModerationStep(moderationResult);
      if (aiResult?.status === "rejected") {
        res.status(400).json({
          message: "Text input rejected by AI Classification",
          textInput: aiResult.moderatedText,
          userId: userId,
        });
        return;
      } else if (aiResult?.status === "unclassifiable"){
        res.status(400).json({
          message: "Text input unclassifiable by AI, needs manual moderation",
          textInput: aiResult.moderatedText,
          userId: userId,
        });
        return;
      }

      // Placeholder for Manual Moderation service
      // const manualModerationResult = await this.moderationService.manualModeration(aiClassificationResult);
      // if(manualModerationResult.status === 'rejected') {
      //     res.status(400).json({message: 'Text input rejected by Manual Moderation', content: manualModerationResult.moderatedText, userId: userId});
      //     return;
      // }


      res.status(200).json({
        message: "Text input created and being moderated",
        content: moderationResult?.moderatedText,
        userId: userId,
      });
    } catch (error) {
      console.error("Error :", error);
    }
  }

  async badWordCheck(req: Request, res: Response): Promise<void> {
    const { inputs } = req.body;

    if (!inputs || typeof inputs !== "string") {
      res.status(400).json({ error: "Invalid or missing input parameter" });
      return;
    }

    const badWordsFound = await getBadWordsFromInput(inputs);
    const containsBadWords = await hasBadWords(inputs);

    if (containsBadWords) {
      res.json({ badWordsFound });
      return;
    }

    res.json({ "response: ": "TextInput contains no bad words" });
  }

  async getBadWordsList(req: Request, res: Response) {
    const badWordsList = getBadWordsList();
    return res.json({ badWordsList });
  }

  async ai(req: Request, res: Response) {
    const { inputs } = req.body;

    try {
      const [distilbert, nsfw, contactInfo] = await Promise.all([
        this.moderationService.distilbert(inputs),
        this.moderationService.nsfw(inputs),
        this.moderationService.contactInfo(inputs),
      ]);

      return res.json({ distilbert, nsfw, contactInfo });
    } catch (error) {
      console.error(`Error in ai: ${error}`);
      res.status(500).send("Internal server error");
    }
  }
}
