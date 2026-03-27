// lib/translate.ts
export async function translateText(text: string, targetLanguage: string) {
  if (!text) return "";
  try {
    // Usamos MyMemory API (Gratuita y sin Key para volúmenes moderados)
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLanguage}`
    );
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error("Error traduciendo:", error);
    return text; // Si falla, devuelve el original
  }
}