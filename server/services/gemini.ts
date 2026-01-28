import { GoogleGenerativeAI } from "@google/generative-ai";



export const generateNightReport = async (gameData: any) => {
    const apiKey = process.env.GEMINI_API_KEY || "";


    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent("wassup beijing")

    return result.response.text();

  
};