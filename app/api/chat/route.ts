import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
    const { messages, temperature } = await req.json();

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        temperature: parseFloat(temperature) || 0.7,
        messages: [
            {
                role: "system",
                content: `You are a seasoned comedian and humorist, tasked with creating jokes that are both clever and enjoyable for a wide audience. Your goal is to craft jokes tailored to the preferences of the audience, taking into account various tones, topics, joke types, and creativity levels.`,
            },
            ...messages,
        ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
