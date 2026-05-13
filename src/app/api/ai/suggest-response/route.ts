import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { reviewContent, rating, businessName } = await request.json();

    if (!reviewContent || !rating) {
      return NextResponse.json({ error: "Missing review content or rating" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const apiKey = groqKey || openaiKey;

    if (!apiKey) {
      return NextResponse.json({
        suggestion: `Thank you for your review! We appreciate your feedback and are always looking to improve. — ${businessName || "The Team"}`,
        source: "default",
      });
    }

    const isPositive = rating >= 4;
    const tone = isPositive ? "warm and appreciative" : "professional and apologetic";
    const baseUrl = groqKey ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1";
    const model = groqKey ? "llama-3.3-70b-versatile" : "gpt-3.5-turbo";

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that writes short business review responses. Keep responses under 100 words. Tone: ${tone}. Sign with the business name if relevant. Never mention being an AI.`,
          },
          {
            role: "user",
            content: `Write a response to this ${rating}-star review from a customer: "${reviewContent}"`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      suggestion: suggestion || "Thank you for your feedback!",
      source: "ai",
    });
  } catch {
    return NextResponse.json({
      suggestion: "Thank you for your review! We appreciate your feedback.",
      source: "default",
    });
  }
}