import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = (model = 'gemini-2.5-flash') => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model });
};

export const FALLBACK_MODEL = 'gemini-2.0-flash';
