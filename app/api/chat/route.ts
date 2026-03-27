import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ role: "assistant", content: "❌ API KEY no configurada en Vercel." });

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 🟢 ENDPOINT CORRECTO PARA FLASH EN VERCEL (v1beta)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Eres Khaz AI, asistente de Khazonli.es. Idioma: ${locale}. Responde breve. Mensaje: ${lastMessage}` }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // 🚩 Si hay un error, lo mostramos tal cual nos lo da Google para saber qué pasa
      return NextResponse.json({ role: "assistant", content: `⚠️ Google dice: ${data.error.message}` });
    }

    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No recibí respuesta de la IA.";
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    return NextResponse.json({ role: "assistant", content: "❌ Error: " + error.message });
  }
}