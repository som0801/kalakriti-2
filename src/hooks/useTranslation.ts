
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TranslationOptions {
  text: string;
  targetLanguage: string;
  onSuccess?: (translatedText: string) => void;
  onError?: (error: Error) => void;
}

export const useTranslation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const translate = async ({ text, targetLanguage, onSuccess, onError }: TranslationOptions) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('ai-translate', {
        body: { text, targetLanguage },
      });

      if (functionError) {
        throw new Error(`Translation error: ${functionError.message}`);
      }

      if (!data || !data.translatedText) {
        throw new Error('Translation failed. No data returned.');
      }

      setTranslatedText(data.translatedText);
      
      if (onSuccess) {
        onSuccess(data.translatedText);
      }
      
      return data.translatedText;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during translation';
      console.error('Translation error:', errorMessage);
      
      setError(err);
      
      if (onError) {
        onError(err);
      } else {
        toast.error(`Translation failed: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    translate,
    loading,
    error,
    translatedText
  };
};
