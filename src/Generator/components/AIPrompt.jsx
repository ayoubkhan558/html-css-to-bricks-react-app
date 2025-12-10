import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaRobot, FaTimes, FaCog } from 'react-icons/fa';
import { callOpenAI } from '@generator/utils/openaiService';
import './AIPrompt.scss';

const AIPrompt = ({ isOpen, onClose, onCodeGenerated, currentHtml, currentCss, currentJs, onOpenSettings }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);
  const textareaRef = useRef(null);
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const apiKey = localStorage.getItem('ai_api_key');
    if (!apiKey) {
      setError('Please set your AI API key in settings first.');
      return;
    }

    const userMessage = prompt.trim();
    setPrompt('');
    setError(null);
    setIsLoading(true);

    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user', content: userMessage }];
    setConversation(newConversation);

    try {
      // Build context for AI
      const context = buildContext(userMessage, currentHtml, currentCss, currentJs);

      const response = await callOpenAI(context, apiKey);

      // Add AI response to conversation
      setConversation([...newConversation, { role: 'assistant', content: response.message }]);

      // Extract and apply code from response
      if (response.html || response.css || response.js) {
        onCodeGenerated({
          html: response.html || currentHtml,
          css: response.css || currentCss,
          js: response.js || currentJs
        });
      }

    } catch (err) {
      setError(err.message || 'Failed to generate code. Please try again.');
      console.error('AI Error:', err);

      // Add helpful context for common errors
      if (err.message.includes('quota')) {
        setError(err.message + ' Visit https://platform.openai.com/account/billing to add credits.');
      } else if (err.message.includes('Rate limit')) {
        setError(err.message + ' If this persists, check your OpenAI usage limits or try a different model.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buildContext = (userPrompt, html, css, js) => {
    const hasExistingCode = html.trim() || css.trim() || js.trim();

    let systemPrompt = `You are an expert web developer assistant. Generate clean, semantic HTML, CSS, and JavaScript code based on user requests.

IMPORTANT INSTRUCTIONS:
1. Always return code in this exact format:
   \`\`\`html
   <your html code>
   \`\`\`
   
   \`\`\`css
   <your css code>
   \`\`\`
   
   \`\`\`javascript
   <your js code>
   \`\`\`

2. Include ALL three sections even if one is empty (use empty code blocks).
3. For updates/modifications, include the COMPLETE updated code, not just the changes.
4. Write modern, responsive, and accessible code.
5. Use semantic HTML5 elements.
6. Include helpful CSS comments for major sections.
7. Keep JavaScript clean and well-commented.`;

    if (hasExistingCode) {
      systemPrompt += `\n\nCURRENT CODE:\n`;
      if (html.trim()) {
        systemPrompt += `
HTML:
\`\`\`html
${html}
\`\`\``;
      }
      if (css.trim()) {
        systemPrompt += `

CSS:
\`\`\`css
${css}
\`\`\``;
      }
      if (js.trim()) {
        systemPrompt += `

JavaScript:
\`\`\`javascript
${js}
\`\`\``;
      }
    }

    return {
      systemPrompt,
      userPrompt
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-prompt-overlay" onClick={onClose}>
      <div className="ai-prompt-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ai-prompt-header">
          <div className="header-title">
            <FaRobot className="robot-icon" />
            <h3>AI Code Assistant</h3>
          </div>
          <div className="header-actions">
            <button className="settings-btn" onClick={onOpenSettings} title="AI Settings">
              <FaCog />
            </button>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="ai-conversation">
          {conversation.length === 0 ? (
            <div className="empty-state">
              <FaRobot className="empty-icon" />
              <h4>Ready to help you code!</h4>
              <p>Ask me to create or modify HTML, CSS, or JavaScript.</p>
              <div className="example-prompts">
                <p><strong>Try asking:</strong></p>
                <ul>
                  <li>"Create a hero section with gradient background"</li>
                  <li>"Add a responsive navigation bar"</li>
                  <li>"Make the button animate on hover"</li>
                  <li>"Change the color scheme to dark blue"</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="messages">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-icon">
                    {msg.role === 'user' ? '👤' : <FaRobot />}
                  </div>
                  <div className="message-content">
                    <pre>{msg.content}</pre>
                  </div>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="ai-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="ai-prompt-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create or modify... (Shift+Enter for new line)"
            rows={3}
            disabled={isLoading}
          />
          <button type="submit" disabled={!prompt.trim() || isLoading}>
            {isLoading ? <FaSpinner className="spinning" /> : <FaPaperPlane />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPrompt;
