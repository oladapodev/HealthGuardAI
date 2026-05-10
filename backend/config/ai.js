// config/ai.js

import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groqClient;

export function hasGroqConfig() {
  return Boolean(process.env.GROQ_API_KEY);
}

export function getGroqClient() {
  if (!hasGroqConfig()) {
    return null;
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
}
