import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ role: "assistant", content: "❌ Error: API_KEY no configurada." });

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 🟢 ENDPOINT Y MODELO ACTUALIZADOS PARA VERCEL
    const MODEL = "gemini-1.5-flash"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Eres Khaz AI, asistente gamer de Khazonli.es. Idioma: ${locale}. Responde breve y profesional. Mensaje: ${lastMessage}` }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ role: "assistant", content: `⚠️ Google dice: ${data.error.message}` });
    }

    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta de la IA.";
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    return NextResponse.json({ role: "assistant", content: "❌ Error de conexión: " + error.message });
  }
}