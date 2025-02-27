import { useClerk } from '@clerk/clerk-react'
import React from 'react'

export default function ImageOptimization() {
  const clerk = useClerk()
  const { user } = clerk
  if (!user) return <p>No Image URL found</p>

  const { imageUrl } = user
  const params = new URLSearchParams()

  params.set('height', '200')
  params.set('width', '200')
  params.set('quality', '100')
  params.set('fit', 'crop')

  const imageSrc = `${imageUrl}?${params.toString()}`

  return (
    <div>
      <h1>Image source:</h1>
      <p>{imageSrc}</p>
      <h2>Image:</h2>
      <img src={imageSrc} alt="User image" />
    </div>
  )
}