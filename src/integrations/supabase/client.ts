
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xihrtxeuuswsucyjetbu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaHJ0eGV1dXN3c3VjeWpldGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQzMDUsImV4cCI6MjA1OTk3MDMwNX0.RWVY2iIgJbf95xYMN8mq6e919KYT7Hgf0WWPNAhBb6s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
