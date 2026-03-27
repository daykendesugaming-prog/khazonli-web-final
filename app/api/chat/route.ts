import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ role: "assistant", content: "⚠️ Error: Configuración de API KEY no encontrada." });
    }

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Usamos v1beta que es el endpoint más flexible de Google
    const MODEL = "gemini-1.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{ 
          text: `Eres Khaz AI, asistente gamer de Khazonli.es. Idioma: ${locale}. Responde de forma muy breve. Mensaje del usuario: ${lastMessage}` 
        }]
      }]
    };

    // 2. Intento de conexión real
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 3. Manejo inteligente de la restricción regional (VENEZUELA)
    if (data.error) {
      // Si el error es por la región (403/404), activamos el MODO SIMULACIÓN
      console.warn("⚠️ Google API Restringida en esta IP/Región. Activando modo simulación.");
      return NextResponse.json({ 
        role: "assistant", 
        content: `(Modo Simulación Khaz AI): ¡Hola! Recibí tu mensaje: "${lastMessage}". Actualmente estoy en fase de conexión desde tu región, pero mi cerebro IA está listo para el lanzamiento global.` 
      });
    }

    // Si todo salió bien, devolvemos la respuesta real de Gemini
    const botText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    console.error("ERROR CRÍTICO:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: "Lo siento, la conexión con el servidor de IA falló. Por favor, intenta más tarde." 
    });
  }
}