
import { openai } from "../config.js";

export default async function callOpenAIChat(
  user_prompt,
  system_prompt,
  model = "gpt-4"
) {
  try {
    const res = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt },
      ],
    });
    const message = res.choices[0]?.message?.content?.trim();
    console.log("OpenAI Response:", message);
    if (message) return message.Json ? JSON.parse(message) : JSON.parse(message);
  } catch (error) {
    return { error: error.message };
  }
}
