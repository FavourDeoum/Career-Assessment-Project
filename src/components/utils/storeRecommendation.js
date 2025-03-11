import { supabase } from "../../supabaseClient"

export const storeRecommendations = async (userId, recommendations) => {
  try {
    const { data, error } = await supabase
      .from("recommendations")
      .insert({ user_id: userId, recommendations: JSON.stringify(recommendations) })

    if (error) throw error
    console.log("Recommendations stored:", data)
    return data
  } catch (error) {
    console.error("Error storing recommendations:", error)
    return null
  }
}

