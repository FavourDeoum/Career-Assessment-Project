import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Store assessment results (using admin client)
export const storeAssessmentResults = async (userId, assessmentData) => {
  const { data, error } = await supabaseAdmin
    .from('career_assessments')
    .upsert([
      {
        user_id: userId,
        answers: assessmentData.answers,
        categories: assessmentData.categories,
        results: assessmentData.results,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: 'user_id' });

  if (error) {
    console.error('Error storing assessment results:', error);
    throw error;
  }

  return data;
};

// Get assessment results (using admin client to bypass RLS)
export const getAssessmentResults = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('career_assessments')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching assessment results:', error);
    return null;
  }

  return data;
};

// Delete assessment results (using admin client)
export const deleteAssessmentResults = async (userId) => {
  const { error } = await supabaseAdmin
    .from('career_assessments')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting assessment results:', error);
    throw error;
  }
};