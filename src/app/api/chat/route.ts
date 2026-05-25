import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, hotelContext } = body;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
        You are the FindMyRoom AI Travel Assistant, a world-class global travel concierge.
        Your goal is to help users evaluate hotels, compare locations, and plan perfect trips anywhere in the world.
        
        Current User Context: ${hotelContext || "The general hotel search page. They are browsing globally."}
        
        Rules:
        1. Keep your answers brief, friendly, and highly helpful (1-2 short paragraphs max).
        2. If the user asks about the hotel or city in their current context, seamlessly act as a local expert for that specific region.
        3. Do not use complex markdown, just simple text.
        4. If they ask for recommendations outside their current context, provide accurate global travel advice.
        `;

        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

        let result;

        //  RETRY 

        try {
            result = await model.generateContent(fullPrompt);
        } catch (apiError: any) {
            if (apiError.status === 503) {
                console.warn("⚠️ Gemini 503 Error. Retrying in 1.5 seconds...");
                await new Promise(resolve => setTimeout(resolve, 1500));
                result = await model.generateContent(fullPrompt);
            }
            //  Catching the Quota Limit (429 Too Many Requests)
            else if (apiError.status === 429) {
                return NextResponse.json({
                    reply: "I've run out of AI brainpower for today! 😭 (Apologies, my developer is a broke final-year student who can only afford the free tier API). Please try again tomorrow!"
                });
            } else {
                throw apiError;
            }
        }

        const responseText = result.response.text();
        return NextResponse.json({ reply: responseText });

    } catch (error: any) {
        console.error("Gemini API Error:", error);

        // Final fallback just in case the quota error bubbles up to the main catch block
        if (error.message?.includes("429") || error.message?.includes("quota")) {
            return NextResponse.json({
                reply: "I've run out of AI brainpower for today! 😭 (Apologies, my developer is a broke final-year student who can only afford the free tier API). Please try again tomorrow!"
            });
        }

        return NextResponse.json(
            { reply: "Sorry, my AI brain is currently offline. Please try again in a moment!" },
            { status: 500 }
        );
    }
}
