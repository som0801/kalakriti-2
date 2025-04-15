
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if bucket exists
    const { data: existingBuckets, error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) {
      throw bucketError;
    }

    const avatarBucketExists = existingBuckets.some(bucket => bucket.name === 'avatars');

    // Create avatars bucket if it doesn't exist
    if (!avatarBucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

      if (createError) {
        throw createError;
      }

      console.log("Created avatars bucket");

      // Set up public bucket policy
      const { error: policyError } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl('sample.txt', 60);

      if (policyError && !policyError.message.includes('sample.txt')) {
        throw policyError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: avatarBucketExists ? "Avatars bucket already exists" : "Created avatars bucket" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error setting up storage:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
