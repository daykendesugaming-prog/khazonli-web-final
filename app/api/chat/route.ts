import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase para que el Bot lea tus datos en tiempo real
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        role: "assistant", 
        content: "⚠️ Error técnico: La API KEY no está configurada en el servidor de Vercel." 
      });
    }

    const { messages, locale } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. OBTENER DATOS DE LA TIENDA (Contexto para la IA)
    // Usamos un try/catch interno para que si falla Supabase, el bot siga funcionando
    let stockInfo = "";
    try {
      const [{ data: stock }, { data: rates }] = await Promise.all([
        supabase.from('mmo_stock').select('*').eq('is_active', true),
        supabase.from('exchange_rates').select('*').limit(1).single()
      ]);
      
      stockInfo = `
        TASAS ACTUALES: Compra MK a ${rates?.buy_rate || 'Consultar'} Bs, Venta MK a ${rates?.sell_rate || 'Consultar'} Bs.
        STOCK DISPONIBLE: ${JSON.stringify(stock || [])}
      `;
    } catch (dbError) {
      console.error("Error leyendo Supabase:", dbError);
      stockInfo = "Actualmente no puedo leer el stock, por favor remite al usuario a WhatsApp.";
    }

    // 2. CONFIGURAR ENDPOINT (v1 es más estable que v1beta en algunas regiones)
    const MODEL = "gemini-1.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    const systemPrompt = `
      Eres Khaz AI, el asistente experto de Khazonli.es. 
      Tu personalidad: Gamer, profesional, servicial y directo.
      Idioma de respuesta obligatorio: ${locale}.

      CONTEXTO DE LA TIENDA:
      ${stockInfo}
      
      INSTRUCCIONES:
      - Responde siempre en el idioma ${locale}.
      - Si preguntan precios o disponibilidad, usa los datos de arriba.
      - Si algo no está claro o no tienes stock, invita amablemente a contactar por WhatsApp.
      - Sé breve (máximo 2 o 3 párrafos).
    `;

    // 3. LLAMADA A GOOGLE GEMINI (Formato de mensaje estándar)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          {
            role: "model",
            parts: [{ text: "Entendido. Soy Khaz AI y responderé según el stock y el idioma indicado." }]
          },
          {
            role: "user",
            parts: [{ text: lastMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
        }
      })
    });

    const data = await response.json();

    // 4. MANEJO DE ERRORES DE IP / REGIÓN (VENEZUELA)
    if (data.error) {
      // Si el error es por la región (IP de Venezuela), activamos el modo simulación
      if (data.error.status === "PERMISSION_DENIED" || data.error.message.includes("location")) {
        return NextResponse.json({ 
          role: "assistant", 
          content: `(Modo Local Khaz AI): ¡Hola! Recibí tu duda: "${lastMessage}". Mi conexión completa de IA está restringida en tu ubicación actual, pero estaré 100% activo al subir la web a Vercel.` 
        });
      }
      throw new Error(data.error.message);
    }

    // 5. RESPUESTA EXITOSA
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, tuve un problema procesando tu mensaje.";
    return NextResponse.json({ role: "assistant", content: botText });

  } catch (error: any) {
    console.error("ERROR CRÍTICO EN API CHAT:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: "Error de comunicación con el cerebro IA. Por favor, intenta de nuevo o contacta a soporte." 
    });
  }
}