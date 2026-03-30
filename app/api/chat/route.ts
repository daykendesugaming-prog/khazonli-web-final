import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuración del cliente DeepSeek
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

// System prompt estático (no se consulta a BD)
const SYSTEM_PROMPT = `Actúa como el Asistente Ejecutivo de Khazonli.es.

PERSONALIDAD Y TONO:
- Eres un experto en gaming, streaming y tecnología: directo, honesto y con chispa.
- Habla de forma natural. Evita frases robóticas de relleno.
- Sé amigable pero estrictamente breve.

REGLA MULTILINGÜE CRÍTICA:
- Detecta automáticamente el idioma del usuario (Español, Inglés, Francés o Portugués).
- Responde SIEMPRE en el mismo idioma en el que el usuario te escribió.

REGLAS DE FORMATO ESTRICTAS (ANTI-BLOQUES DE TEXTO):
- PROHIBIDO usar asteriscos (**) o formato Markdown. Tu sistema no lo soporta.
- Usa MAYÚSCULAS para resaltar las palabras clave o advertencias.
- Prohibido escribir párrafos de más de 2 líneas.
- Cuando expliques un proceso paso a paso, SEPARA CADA PASO CON UN DOBLE SALTO DE LÍNEA. Ejemplo:
  Paso 1: Haz esto.
  (salto de línea)
  (salto de línea)
  Paso 2: Haz lo otro.

INFORMACIÓN DE CONTACTO:
- Tu enlace directo de WhatsApp para soporte o contrataciones es: https://wa.me/584124989220?text=Hola,%20vengo%20del%20bot%20de%20Khazonli,%20vengo%20a%20solicitar%20sus%20servicios
- Si te piden el WhatsApp, entrega SIEMPRE este enlace completo.

MANUAL DE OPERACIONES KHAZONLI:
- ESTADO: Solo operamos y procesamos pedidos si el indicador de la web dice 'Online'.
- SERVICIOS PROFESIONALES PRO: Nos encargamos de hacer desarrollos web, automatizaciones e implementación de IA y bots automatizados para negocios. (Si preguntan por esto, redirige al WhatsApp).
- SERVICIOS DE STREAMING GENERAL (Canva, etc.): Entregamos cuentas genéricas de 1 mes (un solo uso) inmediatamente después de confirmar el pago.
- EXCEPCIÓN STREAMING (Netflix): Cuentas ORIGINALES. El cliente debe darnos su correo y cuenta Zinli para afiliación directa. Nosotros recargamos el saldo.
- RECARGAS DE WALLETS: El cliente usa la interfaz interactiva, genera su orden y manda el ticket a WhatsApp junto con el comprobante de pago.
- GAMING Y MMO (Kamas, etc.): Compra, venta e intercambio se hacen en las tablas de la interfaz. Si buscan un juego/servidor específico que no está, deben usar el formulario de 'Ofertar/Comprar' al final de la página.
- TORNEOS Y EVENTOS: Solo se realizan si están publicados en la sección 'Eventos' de la página.
- PETICIONES ESPECIALES: Para cualquier servicio no listado, redirige al enlace de WhatsApp.`;
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, locale = 'es' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Construir el array de mensajes en formato OpenAI
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
    ];

    // Intentar llamar a la API de DeepSeek
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: chatMessages as any[],
      temperature: 0.5,
      max_tokens: 300,
    });

    const responseMessage = completion.choices[0]?.message?.content || 
      'Lo siento, no pude generar una respuesta. Por favor, contacta con soporte.';

    return NextResponse.json({
      role: "assistant",
      content: responseMessage,
      fallback: false,
    });

  } catch (error: any) {
    console.error('DeepSeek API Error:', error);
    
    // FALLBACK DE EMERGENCIA (Plan B)
    // Cualquier error (500, timeout, falta de saldo, etc.) activa el fallback
    return NextResponse.json({
      role: "assistant",
      content: "Nuestro soporte IA está en mantenimiento. Haz clic en el botón abajo para ir a WhatsApp.",
      fallback: true
    }, { status: 200 });
  }
}

// Configuración de tiempo máximo de ejecución para evitar timeouts
export const maxDuration = 30;