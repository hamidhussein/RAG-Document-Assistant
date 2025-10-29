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
      // Placeholder for Llama (e.g., via Ollama or Replicate)
      console.warn("Llama provider is not yet implemented. Returning a mock response.");
      await new Promise(res => setTimeout(res, 500)); // Simulate network delay
      return "Response from Llama (not implemented).";

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