"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { getUserRecommendations } from "../utils/getUserRecommendations"

const UserRecommendations = () => {
  const { user } = useUser()
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        const userRecommendations = await getUserRecommendations(user.id)
        if (userRecommendations) {
          setRecommendations(userRecommendations)
        }
      }
    }

    fetchRecommendations()
  }, [user])

  if (!user) {
    return <div>Please sign in to view your recommendations.</div>
  }

  return (
    <div>
      <h2>Your Recommendations</h2>
      {recommendations.map((rec) => (
        <div key={rec.id}>
          <p>{rec.recommendation}</p>
          <small>Created at: {new Date(rec.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}

export default UserRecommendations