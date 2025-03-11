import { supabase } from "../supabaseClient"

export const getUserRecommendations = async (userId) => {
  try {
    const { data, error } = await supabase.from("recommendations").select("*").eq("user_id", userId)

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching recommendations:", error.message)
    return null
  }
}

