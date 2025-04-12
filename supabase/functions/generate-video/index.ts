
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
    const { prompt, style, duration, resolution } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Received video generation request:', { prompt, style, duration, resolution });

    // Generate video concept description using OpenAI
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
            content: `You are a video generation AI assistant. Create a detailed scene-by-scene description for a ${duration || '30 second'} video in ${style || 'cinematic'} style with ${resolution || '1080p'} resolution.`
          },
          {
            role: 'user',
            content: `Generate a detailed video script for: ${prompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const storyboard = data.choices[0].message.content;
    
    // For now, this is a simulation of video generation
    // In a real implementation, you would call a video generation API
    const generatedVideo = {
      id: crypto.randomUUID(),
      prompt: prompt,
      style: style || 'cinematic',
      duration: duration || '30 seconds',
      resolution: resolution || '1080p',
      storyboard: storyboard,
      status: "processing",
      estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Estimate 5 minutes
      thumbnail_url: "https://placehold.co/600x400/5535dd/ffffff?text=Video+Processing",
      video_preview_url: null
    };

    console.log('Returning generated video data:', generatedVideo);

    return new Response(
      JSON.stringify(generatedVideo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-video function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
