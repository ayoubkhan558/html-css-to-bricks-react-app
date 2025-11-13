/**
 * AI API Service
 * Handles communication with multiple AI providers (OpenAI, Google Gemini)
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Extract code blocks from AI response
 */
const extractCodeBlocks = (text) => {
  const codeBlocks = {
    html: '',
    css: '',
    js: ''
  };

  // Extract HTML
  const htmlMatch = text.match(/```html\n([\s\S]*?)```/i);
  if (htmlMatch) {
    let htmlContent = htmlMatch[1].trim();
    
    // Extract and remove <style> tags from HTML
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    let extractedStyles = [];
    
    while ((styleMatch = styleRegex.exec(htmlContent)) !== null) {
      extractedStyles.push(styleMatch[1].trim());
    }
    
    if (extractedStyles.length > 0) {
      codeBlocks.css = extractedStyles.join('\n\n');
      // Remove style tags from HTML
      htmlContent = htmlContent.replace(styleRegex, '');
    }
    
    // Extract and remove <script> tags from HTML
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    let extractedScripts = [];
    
    while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
      extractedScripts.push(scriptMatch[1].trim());
    }
    
    if (extractedScripts.length > 0) {
      codeBlocks.js = extractedScripts.join('\n\n');
      // Remove script tags from HTML
      htmlContent = htmlContent.replace(scriptRegex, '');
    }
    
    codeBlocks.html = htmlContent.trim();
  }

  // Extract CSS from dedicated CSS code block (will override if found)
  const cssMatch = text.match(/```css\n([\s\S]*?)```/i);
  if (cssMatch) {
    codeBlocks.css = cssMatch[1].trim();
  }

  // Extract JavaScript from dedicated JS code block (will override if found)
  const jsMatch = text.match(/```(?:javascript|js)\n([\s\S]*?)```/i);
  if (jsMatch) {
    codeBlocks.js = jsMatch[1].trim();
  }

  return codeBlocks;
};

/**
 * Call AI provider to generate code
 * @param {Object} context - Context with system and user prompts
 * @param {string} apiKey - AI API key
 * @returns {Promise<Object>} Response with generated code
 */
export const callOpenAI = async (context, apiKey) => {
  const provider = localStorage.getItem('ai_provider') || 'gemini';
  
  if (provider === 'gemini') {
    return callGemini(context, apiKey);
  } else if (provider === 'openrouter') {
    return callOpenRouter(context, apiKey);
  } else {
    return callOpenAIProvider(context, apiKey);
  }
};

/**
 * Call Google Gemini API
 */
const callGemini = async (context, apiKey) => {
  const model = localStorage.getItem('ai_model') || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('Google Gemini API key is required');
  }

  const prompt = `${context.systemPrompt}\n\nUser Request: ${context.userPrompt}`;

  try {
    console.log('Calling Gemini API with model:', model);
    
    const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate code';
      let errorDetails = null;
      
      console.log('Gemini API Error - Status:', response.status, 'Status Text:', response.statusText);
      
      try {
        errorDetails = await response.json();
        console.log('Error details:', errorDetails);
        errorMessage = errorDetails.error?.message || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      if (response.status === 400) {
        throw new Error(`Bad request: ${errorMessage}. Check your API key and request format.`);
      } else if (response.status === 403) {
        throw new Error('API key invalid or doesn\'t have permission. Get a key from https://aistudio.google.com/app/apikey');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 500 || response.status === 503) {
        throw new Error('Gemini server error. Please try again later.');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Gemini API Success - Response received');
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const aiMessage = data.candidates[0].content.parts[0].text;

    // Extract code blocks from the response
    const codeBlocks = extractCodeBlocks(aiMessage);

    return {
      message: aiMessage,
      ...codeBlocks
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};

/**
 * Call OpenRouter API (provides access to free models)
 */
const callOpenRouter = async (context, apiKey) => {
  const model = localStorage.getItem('ai_model') || 'google/gemini-2.0-flash-exp:free';

  if (!apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  const messages = [
    {
      role: 'system',
      content: context.systemPrompt
    },
    {
      role: 'user',
      content: context.userPrompt
    }
  ];

  try {
    console.log('Calling OpenRouter API with model:', model);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Brickify Code Generator'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate code';
      let errorDetails = null;
      
      console.log('OpenRouter API Error - Status:', response.status, 'Status Text:', response.statusText);
      
      try {
        errorDetails = await response.json();
        console.log('Error details:', errorDetails);
        errorMessage = errorDetails.error?.message || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key in settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
      } else if (response.status === 500 || response.status === 503) {
        throw new Error('OpenRouter server error. Please try again later.');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('OpenRouter API Success - Response received');
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenRouter API');
    }
    
    const aiMessage = data.choices[0].message.content;

    // Extract code blocks from the response
    const codeBlocks = extractCodeBlocks(aiMessage);

    return {
      message: aiMessage,
      ...codeBlocks
    };

  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};

/**
 * Call OpenAI API
 */
const callOpenAIProvider = async (context, apiKey) => {
  const model = localStorage.getItem('ai_model') || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const messages = [
    {
      role: 'system',
      content: context.systemPrompt
    },
    {
      role: 'user',
      content: context.userPrompt
    }
  ];

  try {
    console.log('Calling OpenAI API with model:', model);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate code';
      let errorDetails = null;
      
      console.log('OpenAI API Error - Status:', response.status, 'Status Text:', response.statusText);
      
      try {
        errorDetails = await response.json();
        console.log('Error details:', errorDetails);
        errorMessage = errorDetails.error?.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use status-based messages
        console.error('Failed to parse error response:', parseError);
      }
      
      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      } else if (response.status === 429) {
        // Check if it's actually a rate limit or insufficient quota
        const quotaError = errorDetails?.error?.type === 'insufficient_quota';
        if (quotaError) {
          throw new Error('Insufficient quota. Please add credits to your OpenAI account or check your billing settings.');
        }
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 500 || response.status === 503) {
        throw new Error('OpenAI server error. Please try again later.');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('OpenAI API Success - Response received');
    const aiMessage = data.choices[0].message.content;

    // Extract code blocks from the response
    const codeBlocks = extractCodeBlocks(aiMessage);

    return {
      message: aiMessage,
      ...codeBlocks
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};

/**
 * Test API key validity
 */
export const testApiKey = async (apiKey, provider = 'gemini') => {
  try {
    console.log('Testing API key for provider:', provider);
    
    if (provider === 'gemini') {
      const response = await fetch(`${GEMINI_API_URL}/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello' }]
          }]
        })
      });
      
      console.log('Gemini test response status:', response.status);
      
      // For Gemini, we accept:
      // - 200: Success
      // - 400: Bad request but key is valid (might be content policy issue)
      if (response.ok) {
        const data = await response.json();
        console.log('Gemini test success:', data);
        return true;
      }
      
      // Check if it's a 400 with a valid structure (means key works)
      if (response.status === 400) {
        try {
          const errorData = await response.json();
          console.log('Gemini 400 response:', errorData);
          // If we get a structured error, the key is valid
          return errorData && errorData.error;
        } catch (e) {
          return false;
        }
      }
      
      // 403 means invalid key
      if (response.status === 403) {
        const errorData = await response.json();
        console.log('Gemini 403 error:', errorData);
        return false;
      }
      
      // Any other successful response is ok
      return response.ok;
      
    } else if (provider === 'openrouter') {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Brickify Code Generator'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        })
      });
      console.log('OpenRouter test response status:', response.status);
      return response.ok;
    } else {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      console.log('OpenAI test response status:', response.status);
      return response.ok;
    }
  } catch (error) {
    console.error('API key test error:', error);
    return false;
  }
};
