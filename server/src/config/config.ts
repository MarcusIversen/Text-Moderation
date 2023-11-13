import dotenv from 'dotenv';

dotenv.config();

export const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
export const PORT = process.env.PORT || 3000;
export const CONNECTION_STRING = process.env.DATABASE_URL!;
