import {UserService} from "../services/userService";
import {Request, Response} from "express";
import {
  WordModerationService
} from "../services/wordModerationService";

export class ModerationController {
  private wordModerationService: WordModerationService;


  constructor(wordModerationService: WordModerationService) {
    this.wordModerationService = wordModerationService;
  }

  async badWordCheck(req: Request, res: Response): Promise<void> {
    const {inputs} = req.body;

    if (!inputs || typeof inputs !== 'string') {
      res.status(400).json({error: 'Invalid or missing input parameter'});
      return;
    }

    const badWordsFound = await this.wordModerationService.getBadWordsFromInput(inputs);
    const hasBadWords = await this.wordModerationService.hasBadWords(inputs)

    if (hasBadWords) {
      res.json({badWordsFound});
      return;
    }

    res.json({"response: ": "TextInput contains no bad words"});
  };


  async getBadWordsList(req: Request, res: Response){
    const badWordsList = await this.wordModerationService.getBadWordsList();
    return res.json({badWordsList});
  };

}
