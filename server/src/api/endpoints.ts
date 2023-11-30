import {Request, Response} from "express";
import {perhaps, withRetry} from "../utils/utils";
import axios from "axios";
import {HF_ACCESS_TOKEN} from "../config/config";

export const modelEndpoint = (modelUrl: string) => async (req: Request, res: Response) => {
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


