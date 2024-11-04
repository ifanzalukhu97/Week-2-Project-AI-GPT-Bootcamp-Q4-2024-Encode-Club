import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
    const { message } = await req.json();

    try {
        const response = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: message,
        });


        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": "inline; filename=generated_audio.mp3",
            },
        });
    } catch (error) {
        console.error("Error generating audio:", error);
        return new NextResponse("Failed to generate audio", { status: 500 });
    }
}
