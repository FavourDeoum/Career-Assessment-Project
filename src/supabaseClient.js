import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gdjgieaoqhbkwdakkkfb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkamdpZWFvcWhia3dkYWtra2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5ODE2NjAsImV4cCI6MjA1MTU1NzY2MH0.55tp_dnhpi0AyMraJp95kCIqMvwBWvfG8wGN0LGgAEY"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
