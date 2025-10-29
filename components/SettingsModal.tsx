import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { BotIcon, OpenAiIcon, LlamaIcon, ClaudeIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [error, setError] = useState('');

  useEffect(() => {
    setLocalSettings(initialSettings);
    setError(''); // Clear errors when modal is opened or settings change
  }, [initialSettings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!localSettings.apiKey.trim()) {
      setError(`API Key cannot be empty for the selected '${localSettings.apiProvider}' provider.`);
      return;
    }
    if (localSettings.chunkOverlap >= localSettings.chunkSize) {
      setError('Overlap must be smaller than Chunk Size.');
      return;
    }
    setError('');
    onSave(localSettings);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Settings & Actions</h2>
          <p className="text-sm text-slate-400 mt-1">Manage AI provider, chat, and document settings.</p>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          {/* API Configuration */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-sky-400 border-b border-slate-600 pb-2 w-full">API Configuration</legend>
            <div>
              <label htmlFor="apiProvider" className="block text-sm font-medium text-slate-300">
                AI Provider
              </label>
              <select
                id="apiProvider"
                name="apiProvider"
                value={localSettings.apiProvider}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              >
                <option value="gemini">Google Gemini</option>
                <option value="llama">Llama (via Groq)</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Anthropic Claude</option>
              </select>
            </div>
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300">
                API Key {localSettings.apiProvider === 'llama' && '(Groq)'}
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={localSettings.apiKey}
                onChange={handleInputChange}
                placeholder={
                  localSettings.apiProvider === 'llama'
                    ? 'Enter your Groq API key'
                    : 'Enter your API key'
                }
                className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
               {localSettings.apiProvider === 'llama' && (
                <p className="mt-2 text-xs text-slate-500">
                  Llama is provided via the <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline text-sky-400">Groq API</a> for fast inference.
                </p>
              )}
            </div>
          </fieldset>
          
          {/* Document Processing Settings */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-sky-400 border-b border-slate-600 pb-2 w-full">Document Processing</legend>
            <div>
                <label htmlFor="chunkSize" className="block text-sm font-medium text-slate-300">
                Chunk Size (characters)
                </label>
                <input
                type="number"
                id="chunkSize"
                name="chunkSize"
                value={localSettings.chunkSize}
                onChange={handleNumberInputChange}
                min="100"
                step="50"
                className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                <p className="mt-2 text-xs text-slate-500">The number of characters in each text chunk. Recommended: 500-1500.</p>
            </div>
            <div>
                <label htmlFor="chunkOverlap" className="block text-sm font-medium text-slate-300">
                Chunk Overlap (characters)
                </label>
                <input
                type="number"
                id="chunkOverlap"
                name="chunkOverlap"
                value={localSettings.chunkOverlap}
                onChange={handleNumberInputChange}
                min="0"
                step="10"
                className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                <p className="mt-2 text-xs text-slate-500">How many characters to overlap between chunks. Recommended: 50-200.</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-md text-center text-xs text-slate-500 border border-slate-700">
              <p><span className="font-semibold text-slate-400">Note:</span> These settings only affect newly uploaded documents. Please re-upload files to apply new settings.</p>
            </div>
          </fieldset>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md p-3 -mt-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-900/50 flex justify-end space-x-3 rounded-b-xl border-t border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};