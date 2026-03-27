import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ role: "assistant", content: "❌ Error: API_KEY no configurada." });

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 🟢 CAMBIO CRÍTICO: Usamos 'v1' (Estable) y el modelo exacto
    const MODEL = "gemini-1.5-flash"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user", // Especificamos el rol para evitar errores de validación
            parts: [{ 
              text: `System Instruction: Eres Khaz AI, asistente gamer de Khazonli.es. Idioma: ${locale}. Responde breve y profesional. \n\n User Message: ${lastMessage}` 
            }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
        }
      })
    });

    const data = await response.json();

    // Si Google responde con error (ej. por la región o la llave)
    if (data.error) {
      console.error("Google API Error:", data.error);
      return NextResponse.json({ 
        role: "assistant", 
        content: `⚠️ Error de Google: ${data.error.message}` 
      });
    }

    // Extraer la respuesta de forma segura
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botText) {
      return NextResponse.json({ role: "assistant", content: "IA conectada, pero no generó texto. Intenta de nuevo." });
    }

    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    console.error("ERROR CRÍTICO:", error);
    return NextResponse.json({ role: "assistant", content: "❌ Error de conexión: " + error.message });
  }
}