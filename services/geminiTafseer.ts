
import { GoogleGenAI, Type } from "@google/genai";
import { TafseerResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTafseer = async (arabicText: string, englishText: string, surahName: string, ayahNumber: number): Promise<TafseerResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a brief Tafseer (explanation) and reflection for Ayah ${ayahNumber} of Surah ${surahName}.
    
    Arabic: ${arabicText}
    Translation: ${englishText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: { type: Type.STRING },
          tafseer: { type: Type.STRING },
          reflection: { type: Type.STRING },
        },
        required: ["verse", "tafseer", "reflection"]
      },
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse Tafseer response", error);
    return {
      verse: `Surah ${surahName}, Ayah ${ayahNumber}`,
      tafseer: "Explanation unavailable at the moment. Please try again.",
      reflection: "Reflection unavailable."
    };
  }
};
