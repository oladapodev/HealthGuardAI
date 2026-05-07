// config/ai.js

import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Example: set your model name here, e.g. 'mixtral-8x7b-32768' or another Groq-supported model
export const model = groq;