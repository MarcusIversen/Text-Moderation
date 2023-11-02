import * as dotenv from "dotenv";
import axios from "axios";
import express from 'express';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());  // To handle CORS
app.use(express.json()); // To parse JSON request body

app.post('/api/distilbert', async (req, res) => {
    const headers = {
        'Authorization': 'Bearer ' + process.env.HF_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    };
    const data = {
        'inputs': req.body.inputs
    };
    try {
        const result = await axios.post('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', data, { headers: headers });
        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/nsfw', async (req,res) => {
    const headers = {
        'Authorization': 'Bearer ' + process.env.HF_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    };
    const data = {
        'inputs' : req.body.inputs
    };
    try{
        const result = await axios.post('https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier', data, {headers: headers});
        res.json(result.data);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/moderation', async (req,res) => {
    const headers = {
        'Authorization': 'Bearer ' + process.env.HF_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    };
    const data = {
        'inputs' : req.body.inputs
    };
    try{
        const result = await axios.post('https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation', data, {headers: headers});
        res.json(result.data);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/contactInfo', async (req,res) => {
    const headers = {
        'Authorization': 'Bearer ' + process.env.HF_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    };
    const data = {
        'inputs' : req.body.inputs
    };
    try{
        const result = await axios.post('https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information', data, {headers: headers});
        res.json(result.data);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/addresses', async (req,res) => {
    const headers = {
        'Authorization': 'Bearer ' + process.env.HF_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    };
    const data = {
        'inputs' : req.body.inputs
    };
    try{
        const result = await axios.post('https://api-inference.huggingface.co/models/ctrlbuzz/bert-addresses', data, {headers: headers});
        res.json(result.data);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

