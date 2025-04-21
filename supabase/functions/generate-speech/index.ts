
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map of languages to appropriate voice settings
const languageVoiceMap = {
  'english': { voice: 'alloy', model: 'tts-1' },
  'hindi': { voice: 'nova', model: 'tts-1' },
  'tamil': { voice: 'shimmer', model: 'tts-1' },
  'telugu': { voice: 'onyx', model: 'tts-1' },
  'bengali': { voice: 'echo', model: 'tts-1' },
  'marathi': { voice: 'nova', model: 'tts-1' },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'english' } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    if (!text) {
      throw new Error('Text is required for speech generation');
    }

    const languageKey = language.toLowerCase();
    const voiceSettings = languageVoiceMap[languageKey] || languageVoiceMap.english;

    console.log(`Generating speech for text in ${language} using voice ${voiceSettings.voice}`);

    // If the language is not English, we may need to translate the text first
    let textToSpeak = text;
    if (languageKey !== 'english') {
      // Call OpenAI for translation
      const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Translate the following text to ${language}. Provide only the translation, no explanations.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
        }),
      });

      const translationData = await translationResponse.json();
      
      if (translationData.error) {
        throw new Error(`Translation error: ${translationData.error.message}`);
      }

      textToSpeak = translationData.choices[0].message.content.trim();
      console.log(`Translated text: ${textToSpeak}`);
    }

    // Generate speech using OpenAI's TTS API
    const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: voiceSettings.model,
        voice: voiceSettings.voice,
        input: textToSpeak,
        response_format: 'mp3',
      }),
    });

    if (!speechResponse.ok) {
      const error = await speechResponse.text();
      throw new Error(`Speech generation failed: ${error}`);
    }

    // Get the audio as an ArrayBuffer
    const audioBuffer = await speechResponse.arrayBuffer();
    
    // Convert to Base64 for easy transport in JSON
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    return new Response(
      JSON.stringify({
        audio: `data:audio/mp3;base64,${base64Audio}`,
        text: textToSpeak,
        language: language,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-speech function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
