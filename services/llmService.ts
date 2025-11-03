import { AppSettings } from '../types';
import { GoogleGenAI } from '@google/genai';

async function generateGeminiContent(prompt: string, apiKey: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch(error: any) {
        if (error.message.includes('API key not valid')) {
            throw new Error('Invalid Google Gemini API Key. Please check your settings.');
        }
        throw error;
    }
}

async function generateOpenAiContent(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error.message}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateLlamaContent(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API Error: ${errorData.error.message}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateClaudeContent(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        })
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API Error: ${errorData.error.message}`);
    }
    const data = await response.json();
    return data.content[0].text;
}

export async function generateContent(prompt: string, settings: AppSettings): Promise<string> {
    switch (settings.apiProvider) {
        case 'gemini':
            return generateGeminiContent(prompt, settings.apiKey);
        case 'openai':
            return generateOpenAiContent(prompt, settings.apiKey);
        case 'llama':
            return generateLlamaContent(prompt, settings.apiKey);
        case 'claude':
            return generateClaudeContent(prompt, settings.apiKey);
        default:
            throw new Error(`Unsupported API provider: ${settings.apiProvider}`);
    }
}