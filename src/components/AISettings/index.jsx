import React, { useState, useEffect } from 'react';
import { FaTimes, FaKey, FaSave, FaTrash, FaCheckCircle, FaSpinner, FaEdit, FaPlus, FaUpload, FaFileImport, FaCog, FaFileCode } from 'react-icons/fa';
import { aiService } from '@services/ai';
import { useAITemplates } from '@generator/components/hooks';
import './AISettings.scss';

const AISettings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('api');
  const aiTemplates = useAITemplates();

  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openrouter: '',
    openai: ''
  });
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Template editor state
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'naming',
    description: '',
    prompt: ''
  });

  // Design system state - now supports multiple JSONs
  const [designSystems, setDesignSystems] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    // Load saved API keys
    const savedKeys = {
      gemini: localStorage.getItem('ai_api_key_gemini') || '',
      openrouter: localStorage.getItem('ai_api_key_openrouter') || '',
      openai: localStorage.getItem('ai_api_key_openai') || ''
    };
    setApiKeys(savedKeys);

    const savedProvider = localStorage.getItem('ai_provider') || 'gemini';
    const savedModel = localStorage.getItem('ai_api_key');
    setProvider(savedProvider);
    if (savedModel) setModel(savedModel);

    // Load design systems (array of JSONs)
    const savedDesignSystems = localStorage.getItem('ai_design_systems');
    if (savedDesignSystems) {
      try {
        setDesignSystems(JSON.parse(savedDesignSystems));
      } catch (e) {
        console.error('Failed to load design systems:', e);
      }
    }
  }, [isOpen]);

  // API Key handlers
  const handleSave = async () => {
    const currentApiKey = apiKeys[provider];
    if (currentApiKey.trim()) {
      setIsTesting(true);
      setTestResult(null);
      try {
        aiService.configure(provider, currentApiKey.trim(), model);
        const response = await aiService.generate('Say "API key is valid"', {
          systemPrompt: 'You are a helpful assistant. Respond with exactly what the user asks.'
        });
        if (response) {
          localStorage.setItem(`ai_api_key_${provider}`, currentApiKey.trim());
          localStorage.setItem('ai_provider', provider);
          localStorage.setItem('ai_model', model);
          setIsSaved(true);
          setTestResult('API key is valid and working!');
          setTimeout(() => onClose(), 1000);
        }
      } catch (error) {
        setTestResult('Invalid API key or network error.');
      } finally {
        setIsTesting(false);
      }
    }
  };

  const handleDelete = () => {
    localStorage.removeItem(`ai_api_key_${provider}`);
    setApiKeys(prev => ({ ...prev, [provider]: '' }));
    setIsSaved(false);
    setTestResult(null);
  };

  // Template handlers
  const handleCreateTemplate = () => {
    setEditingTemplate({}); // Set to empty object to trigger form display
    setTemplateForm({ name: '', category: 'naming', description: '', prompt: '' });
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      category: template.category,
      description: template.description,
      prompt: template.prompt
    });
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.prompt) {
      alert('Please fill in both name and prompt');
      return;
    }

    if (editingTemplate) {
      // Update existing template
      aiTemplates.updateTemplate(editingTemplate.id, templateForm);
    } else {
      // Create new template
      aiTemplates.createTemplate(templateForm);
    }

    // Reset form
    setEditingTemplate(null);
    setTemplateForm({ name: '', category: 'naming', description: '', prompt: '' });

    // Reload templates to show updated list
    setTimeout(() => {
      aiTemplates.reload();
    }, 100);
  };

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      aiTemplates.deleteTemplate(templateId);
    }
  };

  // Design System handlers - now supports multiple JSONs
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        // Validate structure
        if (!json.colors && !json.typography && !json.spacing && !json.variables && !json.classes) {
          setUploadError('Invalid JSON: Must contain at least one of: colors, typography, spacing, variables, or classes');
          return;
        }

        // Add filename for identification
        const newDesignSystem = {
          id: Date.now(),
          filename: file.name,
          data: json
        };

        const updatedSystems = [...designSystems, newDesignSystem];
        setDesignSystems(updatedSystems);
        localStorage.setItem('ai_design_systems', JSON.stringify(updatedSystems));
        setUploadError(null);

        // Reset file input
        event.target.value = '';
      } catch (error) {
        setUploadError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveDesignSystem = (id) => {
    const updated = designSystems.filter(ds => ds.id !== id);
    setDesignSystems(updated);
    localStorage.setItem('ai_design_systems', JSON.stringify(updated));
  };

  const handleAddJsonText = () => {
    if (!jsonText.trim()) {
      setUploadError('Please enter JSON text');
      return;
    }

    try {
      const json = JSON.parse(jsonText);

      // Validate structure
      if (!json.colors && !json.typography && !json.spacing && !json.variables && !json.classes) {
        setUploadError('Invalid JSON: Must contain at least one of: colors, typography, spacing, variables, or classes');
        return;
      }

      // Add with auto-generated name
      const newDesignSystem = {
        id: Date.now(),
        filename: `Pasted JSON ${designSystems.length + 1}`,
        data: json
      };

      const updatedSystems = [...designSystems, newDesignSystem];
      setDesignSystems(updatedSystems);
      localStorage.setItem('ai_design_systems', JSON.stringify(updatedSystems));
      setUploadError(null);
      setJsonText(''); // Clear textarea
    } catch (error) {
      setUploadError('Invalid JSON format: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-settings-modal">
      <div className="ai-settings-modal__overlay" onClick={onClose} />
      <div className="ai-settings-modal__content">
        <div className="ai-settings-modal__header">
          <h2>AI Settings</h2>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="ai-settings-tabs">
          <button
            className={`ai-settings-tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <FaKey /> API Keys
          </button>
          <button
            className={`ai-settings-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <FaFileCode /> Templates
          </button>
          <button
            className={`ai-settings-tab ${activeTab === 'design-system' ? 'active' : ''}`}
            onClick={() => setActiveTab('design-system')}
          >
            <FaCog /> Design System
          </button>
        </div>

        <div className="ai-settings-modal__body">
          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="settings-section">
              <div className="form-group">
                <label>Provider</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>

              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  value={apiKeys[provider]}
                  onChange={(e) => setApiKeys({ ...apiKeys, [provider]: e.target.value })}
                  placeholder={`Enter your ${provider} API key`}
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model name"
                />
              </div>

              {testResult && <div className="test-result">{testResult}</div>}

              <div className="button-group">
                {apiKeys[provider] && (
                  <button onClick={handleDelete} className="button secondary">
                    <FaTrash /> Delete Key
                  </button>
                )}
                <button onClick={handleSave} disabled={!apiKeys[provider]?.trim() || isTesting} className="button primary">
                  {isTesting ? <><FaSpinner className="spinning" /> Testing...</> : <><FaSave /> Save</>}
                </button>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="settings-section templates-section">
              <div className="templates-header">
                <h3>Prompt Templates</h3>
                <button onClick={handleCreateTemplate} className="button primary small">
                  <FaPlus /> New Template
                </button>
              </div>

              {(editingTemplate !== null || templateForm.name || templateForm.prompt) && (
                <div className="template-editor">
                  <h4>{editingTemplate ? 'Edit Template' : 'New Template'}</h4>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      placeholder="Template name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={templateForm.category} onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}>
                      <option value="naming">Naming</option>
                      <option value="quality">Quality</option>
                      <option value="refactoring">Refactoring</option>
                      <option value="structure">Structure</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      placeholder="Short description"
                    />
                  </div>
                  <div className="form-group">
                    <label>Prompt</label>
                    <textarea
                      value={templateForm.prompt}
                      onChange={(e) => setTemplateForm({ ...templateForm, prompt: e.target.value })}
                      placeholder="Template prompt that will be added to AI system message..."
                      rows={6}
                    />
                  </div>
                  <div className="button-group">
                    <button onClick={() => { setEditingTemplate(null); setTemplateForm({ name: '', category: 'naming', description: '', prompt: '' }); }} className="button secondary">
                      Cancel
                    </button>
                    <button onClick={handleSaveTemplate} disabled={!templateForm.name || !templateForm.prompt} className="button primary">
                      <FaSave /> Save Template
                    </button>
                  </div>
                </div>
              )}

              <div className="templates-list">
                <h4 style={{ marginTop: 20 }}>Custom Templates</h4>
                {aiTemplates.templates.filter(t => t.type === 'custom').length === 0 ? (
                  <p style={{ color: 'var(--color-text-2)', fontStyle: 'italic' }}>No custom templates yet</p>
                ) : (
                  aiTemplates.templates.filter(t => t.type === 'custom').map(template => (
                    <div key={template.id} className="template-item">
                      <div className="template-info">
                        <strong>{template.name}</strong>
                        <span className="template-category">{template.category}</span>
                        <p>{template.description}</p>
                      </div>
                      <div className="button-group-inline">
                        <button onClick={() => handleEditTemplate(template)} className="button secondary small">
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDeleteTemplate(template.id)} className="button secondary small">
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <h4>Default Templates</h4>
                {aiTemplates.templates.filter(t => t.type === 'default').map(template => (
                  <div key={template.id} className="template-item">
                    <div className="template-info">
                      <strong>{template.name}</strong>
                      <span className="template-category">{template.category}</span>
                      <p>{template.description}</p>
                    </div>
                    <button onClick={() => handleEditTemplate(template)} className="button secondary small" disabled>
                      View Only
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design System Tab */}
          {activeTab === 'design-system' && (
            <div className="settings-section design-system-section">
              <h3>Bricks Design System</h3>
              <p style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
                Upload JSON files with your Bricks colors, typography, spacing, variables, and classes.
                AI will extract variable names and use them when generating code.
              </p>

              {/* Upload Area */}
              <div className="upload-area">
                <label htmlFor="design-system-upload" className="upload-label">
                  <FaUpload size={32} />
                  <span>Click to upload JSON file</span>
                  <small>Can upload multiple files. Each should contain: colors, typography, spacing, variables, or classes</small>
                </label>
                <input
                  id="design-system-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {uploadError && <div className="upload-error">{uploadError}</div>}
              </div>

              {/* OR paste JSON text */}
              <div className="json-text-input">
                <h4>Or Paste JSON Text:</h4>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='Paste your JSON here, e.g.: {"colors": {"primary": "#3B82F6"}}'
                  rows={6}
                />
                <button
                  onClick={handleAddJsonText}
                  className="button primary"
                  disabled={!jsonText.trim()}
                >
                  <FaPlus /> Add JSON
                </button>
              </div>

              {/* List of Uploaded Files */}
              {designSystems.length > 0 && (
                <div className="design-systems-list">
                  <h4>Uploaded Design Systems ({designSystems.length})</h4>
                  {designSystems.map((ds) => (
                    <div key={ds.id} className="design-system-item">
                      <div className="design-system-info">
                        <strong>{ds.filename}</strong>
                        <div className="design-system-stats">
                          {ds.data.colors && <span>{Object.keys(ds.data.colors).length} colors</span>}
                          {ds.data.typography && <span>{Object.keys(ds.data.typography).length} typography</span>}
                          {ds.data.spacing && <span>{Object.keys(ds.data.spacing).length} spacing</span>}
                          {ds.data.variables && <span>{Object.keys(ds.data.variables).length} variables</span>}
                          {ds.data.classes && <span>{ds.data.classes.length} classes</span>}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveDesignSystem(ds.id)} className="button secondary small">
                        <FaTrash /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Example Structure */}
              <div className="design-system-example">
                <h4>Example JSON Structure:</h4>
                <pre>{`{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "text": "#1F2937",
    "background": "#FFFFFF"
  },
  "typography": {
    "heading-1": { "fontSize": "2.25rem", "fontWeight": "700" },
    "body": { "fontSize": "1rem", "lineHeight": "1.5" }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "variables": {
    "--border-radius": "8px",
    "--transition": "all 0.3s ease"
  },
  "classes": ["container", "flex", "grid", "btn", "card"]
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettings;
