"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsFlipped(false)
  }, [front, back])

  return (
    <div className="cursor-pointer perspective-1000 w-64 h-64 mx-auto" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <Card className="absolute w-full h-full backface-hidden">
          <CardContent className="p-4 h-full flex items-center justify-center bg-zinc-900">
            <div className="text-center text-lg font-semibold text-white">{front}</div>
          </CardContent>
        </Card>
        <Card className="absolute w-full h-full backface-hidden rotate-y-180">
          <CardContent className="p-4 h-full flex items-center justify-center bg-zinc-900">
            <div className="text-center text-lg font-semibold text-white">{back}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

