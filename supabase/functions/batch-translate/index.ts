
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage } = await req.json();

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      throw new Error('Missing required parameters: texts (array) and targetLanguage');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Batch translating ${texts.length} items to ${targetLanguage}`);

    // Prepare the text for batch translation
    const combinedText = texts.map((text, index) => `[${index}]: ${text}`).join('\n\n');

    // Use OpenAI to translate text
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following numbered texts into ${targetLanguage}. 
                      Maintain the exact same format with the indices in brackets.
                      Example:
                      [0]: Hello
                      [1]: How are you?
                      
                      Would be translated to Hindi as:
                      [0]: नमस्ते
                      [1]: आप कैसे हैं?
                      
                      Only respond with the translated text, keeping the exact same [index] format.`
          },
          {
            role: 'user',
            content: combinedText
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const translatedContent = data.choices[0].message.content.trim();
    
    // Parse the translated content back into an array
    const regex = /\[(\d+)\]:\s*(.*?)(?=\n\[|$)/gs;
    const translatedTexts = [];
    let match;
    
    while ((match = regex.exec(translatedContent + "\n[")) !== null) {
      const index = parseInt(match[1]);
      const text = match[2].trim();
      translatedTexts[index] = text;
    }
    
    // Ensure we have translations for all original texts
    if (translatedTexts.length !== texts.length) {
      console.warn('Translation mismatch: expected', texts.length, 'got', translatedTexts.length);
      // Fill in missing translations with original text
      texts.forEach((text, i) => {
        if (!translatedTexts[i]) translatedTexts[i] = text;
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        translatedTexts,
        targetLanguage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in batch-translate function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
