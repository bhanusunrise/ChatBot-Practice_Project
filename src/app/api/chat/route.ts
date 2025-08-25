// app/api/chat/route.ts
import OpenAI from "openai";

export const runtime = "nodejs"; // or "edge" if you prefer (Node is simplest)

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    };

    // Simple, non-streaming reply
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return Response.json({ text });
  } catch (err: any) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
