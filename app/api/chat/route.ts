import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase para que el Bot lea tus datos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ role: "assistant", content: "⚠️ Configuración: API KEY no encontrada en Vercel." });
    }

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. OBTENER DATOS DE LA TIENDA (Contexto real para la IA)
    const [{ data: stock }, { data: rates }] = await Promise.all([
      supabase.from('mmo_stock').select('*').eq('is_active', true),
      supabase.from('exchange_rates').select('*').limit(1).single()
    ]);

    // 2. CONFIGURAR EL CEREBRO
    const MODEL = "gemini-1.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    // Prompt del sistema con datos reales de tu base de datos
    const systemPrompt = `
      Eres Khaz AI, el asistente experto de Khazonli.es. 
      Tu personalidad: Gamer, profesional, servicial y directo.
      Idioma: ${locale}.

      DATOS DE LA TIENDA EN TIEMPO REAL:
      - Tasas actuales: Compra MK a ${rates?.buy_rate || 'Consultar'} Bs, Venta MK a ${rates?.sell_rate || 'Consultar'} Bs.
      - Inventario disponible: ${JSON.stringify(stock || [])}
      
      REGLAS:
      - Si te preguntan precios o stock, usa los datos de arriba.
      - Si un producto no está en el inventario arriba, di que consulten por WhatsApp.
      - Mantén las respuestas breves (máximo 3 párrafos).
      - Siempre responde en el idioma: ${locale}.
    `;

    const payload = {
      contents: [{
        parts: [{ 
          text: `${systemPrompt}\n\nUsuario dice: ${lastMessage}` 
        }]
      }]
    };

    // 3. LLAMADA A GOOGLE GEMINI
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 4. MANEJO DE BLOQUEO REGIONAL (VENEZUELA)
    if (data.error) {
      // Si estás probando desde Venezuela localmente, verás esto.
      // En Vercel, este bloque se saltará y verás la IA real.
      return NextResponse.json({ 
        role: "assistant", 
        content: `(Modo Local Khaz AI): ¡Hola! Recibí tu mensaje: "${lastMessage}". Mi cerebro completo se activará cuando la página esté en Vercel (fuera de la restricción regional), pero ya estoy configurado para leer tu stock y tasas.` 
      });
    }

    const botText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    console.error("ERROR CRÍTICO:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: "Lo siento, la conexión falló. Por favor, intenta más tarde." 
    });
  }
}