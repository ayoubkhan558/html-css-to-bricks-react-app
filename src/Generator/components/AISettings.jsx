import React, { useState, useEffect } from 'react';
import { FaTimes, FaKey, FaSave, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { testApiKey } from '../utils/openaiService';
import './AISettings.scss';

const AISettings = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('ai_api_key');
    const savedProvider = localStorage.getItem('ai_provider');
    const savedModel = localStorage.getItem('ai_model');
    
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
    if (savedProvider) {
      setProvider(savedProvider);
    }
    if (savedModel) {
      // Validate that the saved model matches the provider
      if (savedProvider === 'gemini') {
        setModel('gemini-2.5-flash');
      } else if (savedProvider === 'openai' && !savedModel.startsWith('gpt')) {
        setModel('gpt-4o-mini');
      } else {
        setModel(savedModel);
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (apiKey.trim()) {
      // Test the API key first
      setIsTesting(true);
      setTestResult(null);
      
      const isValid = await testApiKey(apiKey.trim(), provider);
      setIsTesting(false);
      
      if (!isValid) {
        setTestResult('Invalid API key or network error. You can try "Save Without Testing" if you\'re sure your key is correct.');
        return;
      }
      
      localStorage.setItem('ai_api_key', apiKey.trim());
      localStorage.setItem('ai_provider', provider);
      localStorage.setItem('ai_model', model);
      setIsSaved(true);
      setTestResult('API key verified and saved successfully!');
      
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleSaveWithoutTest = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ai_api_key', apiKey.trim());
      localStorage.setItem('ai_provider', provider);
      localStorage.setItem('ai_model', model);
      setIsSaved(true);
      setTestResult('Saved without testing. If it doesn\'t work, check your API key.');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('ai_api_key');
    localStorage.removeItem('ai_provider');
    localStorage.removeItem('ai_model');
    setApiKey('');
    setIsSaved(false);
    setTestResult(null);
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setIsSaved(false);
    setTestResult(null);
    
    // Set default model for provider
    if (newProvider === 'gemini') {
      setModel('gemini-2.5-flash');
    } else {
      setModel('gpt-4o-mini');
    }
  };

  const maskApiKey = (key) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 7) + '...' + key.substring(key.length - 4);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-settings-overlay" onClick={onClose}>
      <div className="ai-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-settings-header">
          <h2><FaKey /> AI API Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ai-settings-content">
          <div className="settings-group">
            <label htmlFor="provider">AI Provider</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="model-select"
            >
              <option value="gemini">Google Gemini (Free Tier Available)</option>
              <option value="openai">OpenAI (Paid)</option>
            </select>
            <small className="help-text">
              {provider === 'gemini' ? (
                <>Get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></>
              ) : (
                <>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></>
              )}
            </small>
          </div>

          <div className="settings-group">
            <label htmlFor="api-key">API Key</label>
            <div className="input-group">
              <input
                id="api-key"
                type={isSaved ? 'text' : 'password'}
                value={isSaved && apiKey ? maskApiKey(apiKey) : apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSaved(false);
                }}
                placeholder={provider === 'gemini' ? 'AIza...' : 'sk-...'}
                className="api-key-input"
                disabled={isSaved}
              />
              {isSaved && (
                <button className="clear-btn" onClick={handleClear} title="Clear API Key">
                  <FaTrash />
                </button>
              )}
            </div>
            <small className="help-text">
              {provider === 'gemini' ? (
                'Your key is safe - stored locally in your browser'
              ) : (
                'Your key is safe - stored locally in your browser'
              )}
            </small>
          </div>

          <div className="settings-group">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="model-select"
              disabled={provider === 'gemini'}
            >
              {provider === 'gemini' ? (
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Latest - Fast & Free)</option>
              ) : (
                <>
                  <option value="gpt-4o">GPT-4o (Most Capable)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Faster & Cheaper)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
                </>
              )}
            </select>
            <small className="help-text">
              {provider === 'gemini' ? (
                'Gemini 2.5 Flash - Latest model with enhanced reasoning and advanced coding'
              ) : (
                'Choose based on your needs and budget'
              )}
            </small>
          </div>

          {testResult && (
            <div className={`test-result ${testResult.includes('Invalid') ? 'error' : 'success'}`}>
              {testResult.includes('Invalid') ? '⚠️' : <FaCheckCircle />} {testResult}
            </div>
          )}

          <div className="settings-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            {testResult && testResult.includes('Invalid') && (
              <button 
                className="skip-test-btn" 
                onClick={handleSaveWithoutTest}
                disabled={!apiKey.trim() || isSaved}
              >
                Save Without Testing
              </button>
            )}
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={!apiKey.trim() || isSaved || isTesting}
            >
              {isTesting ? (
                <><FaSpinner className="spinning" /> Testing...</>
              ) : isSaved ? (
                <><FaSave /> Saved!</>
              ) : (
                <><FaSave /> Save Settings</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
