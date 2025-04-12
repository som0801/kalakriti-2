
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
    const { videoDetails, enhancementOptions, languages } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Received enhancement request:', { videoDetails, enhancementOptions, languages });

    // In a real implementation, you would process the video file
    // For now, we'll simulate the enhancement by generating descriptions using OpenAI
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
            content: `You are a video enhancement AI. Generate a title and description for a video based on the provided details.
                      Include details about enhancements: ${JSON.stringify(enhancementOptions)}.
                      Target languages: ${JSON.stringify(languages)}`
          },
          {
            role: 'user',
            content: `Create a catchy title and detailed description for this video: ${videoDetails.fileName || 'Untitled video'}.
                     Additional context: ${videoDetails.description || 'No description provided.'}`
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
    
    // Parse the AI response to extract title and description
    let title = 'Enhanced Video';
    let description = '';
    
    try {
      // Assuming the AI returns a format like "Title: xxx\n\nDescription: yyy"
      const titleMatch = aiResponse.match(/Title:(.+?)(?:\n|$)/);
      const descMatch = aiResponse.match(/Description:(.+)/s);
      
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
      
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim();
      } else {
        description = aiResponse; // Use the whole response if parsing fails
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      description = aiResponse;
    }

    // Simulate the enhancement process with a mock response
    const enhancedVideo = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
      video_url: "https://placehold.co/600x400/8833ff/white?text=Enhanced+Video",
      thumbnail_url: "https://placehold.co/600x400/8833ff/white?text=Enhanced+Video",
      languages: languages,
      enhancements: enhancementOptions,
      status: "completed"
    };

    console.log('Returning enhanced video:', enhancedVideo);

    return new Response(
      JSON.stringify(enhancedVideo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in enhance-video function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
