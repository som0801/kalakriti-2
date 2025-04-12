
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
    const { prompt, title, description, targetAudience, adFormat } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Received ad generation request:', { prompt, title, adFormat });

    // Generate ad description using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an ad generation AI. Generate a compelling ad concept based on the provided prompt.
                      Target audience: ${targetAudience || 'General audience'}.
                      Ad format: ${adFormat || 'Image'}.`
          },
          {
            role: 'user',
            content: `Create an ad concept for: ${prompt}
                     Title: ${title || 'Untitled ad'}
                     Additional details: ${description || 'No additional details provided.'}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const aiResponse = data.choices[0].message.content;
    
    // Simulate the ad generation with a mock response
    const generatedAd = {
      id: crypto.randomUUID(),
      title: title || 'Generated Ad',
      description: aiResponse,
      prompt: prompt,
      target_audience: targetAudience,
      ad_format: adFormat,
      output_url: "https://placehold.co/600x400/8833ff/white?text=Generated+Ad",
      thumbnail_url: "https://placehold.co/600x400/8833ff/white?text=Generated+Ad",
      status: "completed"
    };

    console.log('Returning generated ad:', generatedAd);

    return new Response(
      JSON.stringify(generatedAd),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-ad function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
