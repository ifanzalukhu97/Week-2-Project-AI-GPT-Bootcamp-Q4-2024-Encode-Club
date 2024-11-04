import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

console.log("API Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = "edge";

export async function POST(req: Request) {
    const {messages, temperature} = await req.json();

    const systemMessage = messages[0]?.content?.startsWith("Please evaluate")
        ? {
            role: "system",
            content: `You are an expert joke critic and analyst. Evaluate jokes based on:
            - Humor Level (1-10)
            - Appropriateness (1-10)
            - Originality (1-10)
            - Potential Offensiveness
            - Target Audience Suitability
            
            Provide your evaluation in a clear, structured format.`
        }
        : {
            role: "system",
            content: `You are a seasoned comedian and humorist, tasked with creating jokes that are both clever and enjoyable for a wide audience. Your goal is to craft jokes tailored to the preferences of the audience, taking into account various tones, topics, joke types, and creativity levels.`
        };

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        temperature : parseFloat(temperature),
        stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
