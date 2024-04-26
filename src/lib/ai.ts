import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
