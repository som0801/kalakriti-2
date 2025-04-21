
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
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      throw new Error('Missing required parameters: text and targetLanguage');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Translating to ${targetLanguage}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // Create a more robust translation prompt specific to Indian languages
    const languageContext = {
      'hindi': 'Hindi (हिंदी) is an Indo-Aryan language spoken primarily in India.',
      'tamil': 'Tamil (தமிழ்) is a Dravidian language spoken primarily in Tamil Nadu, India and Sri Lanka.',
      'telugu': 'Telugu (తెలుగు) is a Dravidian language spoken primarily in Andhra Pradesh and Telangana, India.',
      'bengali': 'Bengali (বাংলা) is an Indo-Aryan language spoken primarily in West Bengal, India and Bangladesh.',
      'marathi': 'Marathi (मराठी) is an Indo-Aryan language spoken primarily in Maharashtra, India.'
    };

    const contextInfo = languageContext[targetLanguage.toLowerCase()] || '';

    // Use OpenAI to translate text with improved context
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
            content: `You are a professional translator specialized in Indian languages. ${contextInfo} 
                      Translate the following text into ${targetLanguage}. 
                      Maintain the same tone, style, formatting, and cultural context as the original.
                      Only respond with the translated text, nothing else.
                      Preserve any special characters, HTML markup, or formatting in the original text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({
        success: true,
        translatedText,
        targetLanguage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-translate function:', error);
    
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
