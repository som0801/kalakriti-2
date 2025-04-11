
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface UserPreferences {
  id: string;
  user_id: string;
  default_languages: string[];
  default_enhancements: {
    videoQuality: boolean;
    audioClarity: boolean;
    generateTitle: boolean;
    generateDescription: boolean;
  };
  created_at: string | null;
  updated_at: string | null;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setPreferences(data as UserPreferences);
      } else {
        // Create default preferences if none exist
        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            default_languages: ['English', 'Hindi'],
            default_enhancements: {
              videoQuality: true,
              audioClarity: true,
              generateTitle: true,
              generateDescription: true
            }
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        setPreferences(newData as UserPreferences);
      }
    } catch (err: any) {
      console.error('Error fetching preferences:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!preferences) {
        throw new Error('No preferences found to update');
      }

      const { data, error: updateError } = await supabase
        .from('user_preferences')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', preferences.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setPreferences(data as UserPreferences);
      toast.success('Preferences updated successfully');
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      setError(err);
      toast.error('Failed to update preferences');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences
  };
};
