// OpenRouter API client for AI text generation

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

export async function generateText(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://backrr.com', // Replace with your actual domain
        'X-Title': 'Backrr - Sponsorship Platform'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.1-24b-instruct:free', // Free model on OpenRouter
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates personalized sponsorship application notes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate text');
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}