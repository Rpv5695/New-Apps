
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ErrorType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!text || text.trim().length < 2) {
    return { 
      correctedText: text, 
      corrections: [], 
      isClean: true, 
      refinedVersions: { professional: '', concise: '', creative: '' } 
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following text for grammar, casing, punctuation, and spelling errors. 
    Provide:
    1. The corrected version of the original text.
    2. A list of specific corrections made.
    3. Three refined variations: Professional, Concise, and Creative.
    
    Text to analyze: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: {
            type: Type.STRING,
            description: "The full text after all corrections have been applied.",
          },
          isClean: {
            type: Type.BOOLEAN,
            description: "True if no errors were found in the original text.",
          },
          corrections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalPart: { type: Type.STRING },
                replacementPart: { type: Type.STRING },
                type: { 
                  type: Type.STRING,
                  enum: [ErrorType.CASING, ErrorType.GRAMMAR, ErrorType.PUNCTUATION, ErrorType.SPELLING]
                },
                explanation: { type: Type.STRING },
                startIndex: { type: Type.NUMBER },
                endIndex: { type: Type.NUMBER },
              },
              required: ["originalPart", "replacementPart", "type", "explanation", "startIndex", "endIndex"],
            },
          },
          refinedVersions: {
            type: Type.OBJECT,
            properties: {
              professional: { type: Type.STRING },
              concise: { type: Type.STRING },
              creative: { type: Type.STRING },
            },
            required: ["professional", "concise", "creative"],
          },
        },
        required: ["correctedText", "corrections", "isClean", "refinedVersions"],
      },
    },
  });

  try {
    const result: AnalysisResult = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return { 
      correctedText: text, 
      corrections: [], 
      isClean: true,
      refinedVersions: { professional: '', concise: '', creative: '' }
    };
  }
};
