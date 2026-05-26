"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getRedditSummary(city: string) {
    try {

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);


        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Act as an expert travel data aggregator. Summarize the general consensus of what Reddit users say about traveling to ${city}. 
            Format the response using clean, bolded bullet points. 
            You MUST cover these specific points based on Reddit opinions:
            - Overall tourist friendliness
            - Affordability of stays and food
            - Important places to visit or areas to stay
            - How Couple-Friendly the city is, including specific recommendations for couple-friendly hotels and safe stays (very important)
            - Common good and bad experiences (scams to avoid, transportation tips, etc.)
            
            Keep it punchy, highly readable, and under 250 words. Do not sound like a robot; sound like a helpful local giving the inside scoop based on Reddit threads.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        console.error("Failed to fetch Reddit AI Summary:", error);
        return null;
    }
}