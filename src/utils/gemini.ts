/**
 * Gemini API integration for email classification and reply suggestion
 * Uses gemini-2.5-flash REST endpoint
 */

export interface EmailClassification {
  category: 'Interested' | 'Not Interested' | 'Unknown' | 'Spam' | 'Meeting Booked';
  confidence: number;
  reasoning: string;
  suggested_reply: string;
}

/**
 * Get API key from localStorage or environment
 */
function getGeminiApiKey(): string {
  // Check localStorage
  if (typeof localStorage !== 'undefined') {
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) return localKey;
  }

  // Fallback: Vite env
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  return envKey;
}

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are an assistant that reads a single email and returns a compact machine-readable classification and a short suggested reply. Output must be valid JSON only, no extra text, no markup.

Rules:
1. Classify into one label: "Interested", "Not Interested", "Unknown", "Spam", or "Meeting Booked".
2. Provide a numeric confidence between 0.0 and 1.0.
3. Provide one-sentence human-readable reasoning.
4. Provide a concise suggested_reply (1-2 sentences). If label is Spam, suggested_reply must be an empty string.
5. Keep suggested_reply professional and actionable.
6. Keep all string fields under 300 characters.
7. Do not hallucinate facts. Use only content in the provided email.
8. Output JSON with these exact keys in this order: category, confidence, reasoning, suggested_reply.`;

/**
 * Classify an email and get a suggested reply using Gemini API
 */
export async function classifyEmailWithGemini(
  emailBody: string,
  emailDate?: string
): Promise<EmailClassification> {
  const GEMINI_API_KEY = getGeminiApiKey();

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured');
    return {
      category: 'Unknown',
      confidence: 0,
      reasoning: 'Missing API key',
      suggested_reply: '',
    };
  }

  const userMessage = `Email: """${emailBody}"""
Date: ${emailDate || ''}

Produce the JSON output now.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    let generatedText = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.text) {
      generatedText = data.candidates[0].text;
    } else if (data?.candidates?.[0]?.output) {
      generatedText = data.candidates[0].output;
    } else if (data?.text) {
      generatedText = data.text;
    }

    if (!generatedText) {
      console.error('Could not find text in response. Candidate:', data?.candidates?.[0]);
      throw new Error('No valid text in Gemini response');
    }
    
    // Check if response was truncated
    if (data?.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      console.warn('Warning: Response was truncated due to max tokens limit');
    }

    // Clean code blocks if present
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/```$/, '').trim();
    }

    const classification: EmailClassification = JSON.parse(jsonText);

    const validCategories = [
      'Interested',
      'Not Interested',
      'Unknown',
      'Spam',
      'Meeting Booked',
    ];
    if (!validCategories.includes(classification.category)) {
      classification.category = 'Unknown';
    }

    classification.confidence = Math.min(
      1,
      Math.max(0, classification.confidence)
    );

    return classification;
  } catch (err: any) {
    console.error('Error classifying email with Gemini:', err);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to classify email';
    if (err.message?.includes('503') || err.message?.includes('overloaded')) {
      errorMessage = 'Gemini API is temporarily overloaded. Please try again in a moment.';
    } else if (err.message?.includes('401') || err.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your Gemini API key.';
    } else if (err.message?.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please wait before trying again.';
    } else if (err instanceof SyntaxError) {
      errorMessage = 'Invalid response format from Gemini API. Response may have been truncated.';
    }
    
    return {
      category: 'Unknown',
      confidence: 0,
      reasoning: errorMessage,
      suggested_reply: '',
    };
  }
}

/**
 * Utility wrapper to get only suggested reply text
 */
export async function getSuggestedReply(
  emailBody: string,
  emailDate?: string
): Promise<string> {
  const result = await classifyEmailWithGemini(emailBody, emailDate);
  return result.suggested_reply;
}
