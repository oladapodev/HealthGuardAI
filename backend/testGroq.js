import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testGroq() {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Use a current model from listmodel.cjs
      messages: [
        { role: 'user', content: 'Hello, respond in one sentence.' }
      ]
    });
    console.log('Groq AI Response:', completion.choices[0].message.content);
  } catch (err) {
    console.error('Groq AI Error:', err.message);
  }
}

testGroq();
