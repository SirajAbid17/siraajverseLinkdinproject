import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey ="AIzaSyBOq5AoTB28xpd46tA9MHAK-UHTNmsH53g";

const genai = new GoogleGenerativeAI(geminiApiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  response_mime_type: "text/plain" 
};

const model = genai.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig
});

export default async function sendQueryToGemini(userText: string) {
  try {
    const result = await model.generateContent(userText);
    const response = await result.response;
    return response.text(); 
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, I couldn't process your request.";
  }
}