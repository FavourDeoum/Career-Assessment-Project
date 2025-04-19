import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gdjgieaoqhbkwdakkkfb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkamdpZWFvcWhia3dkYWtra2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5ODE2NjAsImV4cCI6MjA1MTU1NzY2MH0.55tp_dnhpi0AyMraJp95kCIqMvwBWvfG8wGN0LGgAEY"
const supabaseServiceKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkamdpZWFvcWhia3dkYWtra2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk4MTY2MCwiZXhwIjoyMDUxNTU3NjYwfQ.Dcu6Wi0ClM_3qIWXeeOwoMj8qrqsszW5kXAPed-vU7s"
if (!supabaseUrl || !supabaseAnonKey) {
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

// Get assessment results (using regular client)
export const getAssessmentResults = async (userId) => {
  const { data, error } = await supabase
    .from('career_assessments')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Ignore "no rows" error
      console.error('Error fetching assessment results:', error);
    }
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