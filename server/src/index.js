import * as dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

const createModelEndpoint = (modelUrl) => async (req, res) => {
    const headers = {
        Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    };
    const data = {
        inputs: req.body.inputs,
    };
    try {
        const result = await axios.post(modelUrl, data, { headers });
        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


app.post('/api/distilbert', createModelEndpoint('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english'));
app.post('/api/nsfw', createModelEndpoint('https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier'));
app.post('/api/moderation', createModelEndpoint('https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation'));
app.post('/api/contactInfo', createModelEndpoint('https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information'));
app.post('/api/addresses', createModelEndpoint('https://api-inference.huggingface.co/models/ctrlbuzz/bert-addresses'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
