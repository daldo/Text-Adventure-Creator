import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './UI/Button';
import Card from './UI/Card';
import { initializeOpenAI, getStoredApiKey, isOpenAIConfigured } from '../services/openaiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Check if we already have a stored API key
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = initializeOpenAI(apiKey.trim());
      
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Failed to initialize OpenAI client. Please check your API key.');
      }
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      setError('An error occurred while setting up OpenAI. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="p-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            OpenAI API Key
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To generate text adventures, you need to provide your OpenAI API key. 
            Your key is stored locally in your browser and is never sent to our servers.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="apiKey" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="sk-..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your API key from the <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  OpenAI dashboard
                </a>
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!apiKey.trim() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save API Key'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ApiKeyModal;
