import {Request, Response} from "express";
import {perhaps, withRetry} from "../utils/utils";
import axios from "axios";
import {HF_ACCESS_TOKEN} from "../config/config";
import {getBadWordsInSentence, getBadWordsList, hasBadWords} from "../services/wordModerationService";

export const modelEndpoint = (modelUrl: any) => async (req: Request, res: Response) => {
  const headers = {
    Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const data = { inputs: req.body.inputs };
  const [myError, myValue] = await
      perhaps(withRetry({})(axios.post(modelUrl, data, {headers})));

  if (myError) {
    res.status(500).json({
      error: myError.message
    })
    return;
  }

  if (!myValue) {
    res.status(404).json({
      error: 'Not found'
    })
    return;
  }

  res.json(myValue.data);
  return;
};

export const wordCheckEndpoint = () => async (req: Request, res: Response) => {
  const sentence = req.query.sentence;

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({error: 'Invalid or missing sentence parameter'});
  }

  const badWordsFound = getBadWordsInSentence(sentence);

  if (hasBadWords(sentence)) {
    return res.json({badWordsFound});
  }

  return res.json({"response: ": "TextInput contains no bad words"});
};

export const badWordsListEndpoint = () => async (req: Request, res: Response) => {
  const badWordsList = getBadWordsList();
  return res.json({badWordsList});
};

