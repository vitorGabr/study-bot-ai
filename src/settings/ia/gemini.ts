import { GoogleGenerativeAI } from "@google/generative-ai";

export const geminiAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
