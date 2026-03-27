import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ role: "assistant", content: "⚠️ Configuración: API KEY no encontrada." });

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Obtener contexto de la tienda
    const [{ data: stock }, { data: rates }] = await Promise.all([
      supabase.from('mmo_stock').select('*').eq('is_active', true),
      supabase.from('exchange_rates').select('*').limit(1).single()
    ]);

    const systemPrompt = `Eres Khaz AI, asistente de Khazonli.es. Idioma: ${locale}. 
    Contexto: Tasas ${rates?.buy_rate} Bs. Stock: ${JSON.stringify(stock)}. 
    Responde de forma breve y gamer.`;

    // 2. URL de Google Gemini Estable (v1)
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUsuario: ${lastMessage}` }] }]
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const botText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    console.error("CHAT ERROR:", error.message);
    return NextResponse.json({ 
      role: "assistant", 
      content: "Error: No pude conectar con mi cerebro IA. Verifica la API KEY en Vercel." 
    });
  }
}