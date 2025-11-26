import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to parse base64 data and mime type from Data URL
const processBase64 = (dataUrl: string) => {
  // If it contains a comma, it likely has a data URI scheme prefix
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex !== -1) {
    const header = dataUrl.substring(0, commaIndex);
    const data = dataUrl.substring(commaIndex + 1);
    
    // Extract mime type from header like "data:image/jpeg;base64"
    const mimeMatch = header.match(/data:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    
    return { mimeType, data };
  }
  
  // No comma found, assume it's raw base64 data without prefix
  return { mimeType: "image/jpeg", data: dataUrl };
};

// --- Image Generation / Editing (Nano Banana / Gemini 2.5 Flash Image) ---

export const generateRedesign = async (
  imageBase64: string, 
  stylePrompt: string
): Promise<string> => {
  const ai = getAIClient();
  const modelId = "gemini-2.5-flash-image";

  try {
    const { mimeType, data } = processBase64(imageBase64);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Redesign this room. ${stylePrompt}. Maintain the structural layout but change furniture, colors, and decor to match the style. High resolution, photorealistic.`,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Redesign error:", error);
    throw error;
  }
};

export const editRoomDesign = async (
  currentImageBase64: string,
  editPrompt: string
): Promise<string> => {
  const ai = getAIClient();
  // Using gemini-2.5-flash-image for editing as requested ("Nano banana")
  const modelId = "gemini-2.5-flash-image";

  try {
    const { mimeType, data } = processBase64(currentImageBase64);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Edit this image: ${editPrompt}. Ensure the result is photorealistic and high quality.`,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Edit design error:", error);
    throw error;
  }
};

const extractImageFromResponse = (response: GenerateContentResponse): string => {
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/jpeg';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image generated");
};


// --- Chat / Advisory (Gemini 3 Pro Preview) ---

let chatSession: Chat | null = null;

export const initializeChatSession = () => {
  const ai = getAIClient();
  // Using gemini-3-pro-preview for complex reasoning and chat
  chatSession = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: "You are an expert Interior Design Consultant. You help users refine their room designs. You provide helpful advice on colors, layouts, and furniture. When users ask for products, use Google Search to find real shoppable links.",
      tools: [{ googleSearch: {} }],
    },
  });
};

export const sendChatMessage = async (
  message: string
): Promise<{ text: string; links?: { title: string; url: string }[] }> => {
  if (!chatSession) {
    initializeChatSession();
  }

  try {
    if (!chatSession) throw new Error("Chat session failed to initialize");

    const response = await chatSession.sendMessage({ message });
    const text = response.text || "I couldn't generate a response.";
    
    // Extract grounding chunks for links
    const links: { title: string; url: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
            // Filter out duplicates if needed or just push
            links.push({
                title: chunk.web.title || "Source",
                url: chunk.web.uri
            });
        }
      });
    }

    return { text, links };
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};