import { GoogleGenAI } from '@google/genai';
import { AppSettings } from '../types';

/**
 * Generates a response from the configured Large Language Model.
 *
 * @param prompt - The complete prompt to send to the model.
 * @param settings - The application settings, including the API provider and key.
 * @returns The text response from the model.
 */
export const generateResponse = async (
  prompt: string,
  settings: AppSettings
): Promise<string> => {
  switch (settings.apiProvider) {
    case 'gemini':
      return generateGeminiResponse(prompt, settings.apiKey);
    
    case 'openai':
      // Placeholder for OpenAI API call
      console.warn("OpenAI provider is not yet implemented. Returning a mock response.");
      await new Promise(res => setTimeout(res, 500)); // Simulate network delay
      return "Response from OpenAI (not implemented).";

    case 'llama':
      return generateLlamaResponse(prompt, settings.apiKey);

    case 'claude':
      // Placeholder for Anthropic Claude API call
      console.warn("Claude provider is not yet implemented. Returning a mock response.");
      await new Promise(res => setTimeout(res, 500)); // Simulate network delay
      return "Response from Claude (not implemented).";

    default:
      throw new Error(`Unknown API provider: ${settings.apiProvider}`);
  }
};

const generateGeminiResponse = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

const generateLlamaResponse = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("Llama (Groq) API key is missing.");
  }

  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Using a Llama 3 model via Groq
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from Llama model.";

  } catch (error) {
    console.error("Error calling Groq API:", error);
    // Re-throw the error to be caught by the UI and displayed to the user
    if (error instanceof Error) {
        throw new Error(`Llama (Groq) API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred with the Llama (Groq) API.');
  }
};
