
import { model } from "../config/ai.js";
import models from "./listmodel.cjs";

// Change this index to select a different model from the list
export let modelIndex = 0;
export function setModelIndex(idx) {
  if (idx >= 0 && idx < models.length) modelIndex = idx;
  else throw new Error("Invalid model index");
}


const GROQ_MODEL = () => models[1];

export async function runAI(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const completion = await model.chat.completions.create({
        model: models[modelIndex],
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
        console.error('AI response missing content:', completion);
        throw new Error('AI response missing content');
      }
      return completion.choices[0].message.content;
    } catch (err) {
      console.log(`AI attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
}