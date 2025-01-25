"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Flashcard {
  front: string
  back: string
}

export interface FlashcardSet {
  _id: string
  title: string
  cards: Flashcard[]
}

interface FlashcardContextType {
  flashcardSets: FlashcardSet[]
  addFlashcardSet: (newSet: Omit<FlashcardSet, "_id">) => void
  isLoading: boolean
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined)

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await fetch("/api/flashcards")
        const data = await response.json()
        if (data.success) {
          setFlashcardSets(data.flashcardSets)
        } else {
          console.error("Failed to fetch flashcard sets:", data.error)
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashcardSets()
  }, [])

  const addFlashcardSet = async (newSet: Omit<FlashcardSet, "_id">) => {
    try {
      const response = await fetch("/api/flashcards/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSet),
      })
      const data = await response.json()
      if (data.success) {
        setFlashcardSets((prevSets) => [...prevSets, { ...newSet, _id: data.id }])
      } else {
        console.error("Failed to add flashcard set:", data.error)
      }
    } catch (error) {
      console.error("Error adding flashcard set:", error)
    }
  }

  return (
    <FlashcardContext.Provider value={{ flashcardSets, addFlashcardSet, isLoading }}>
      {children}
    </FlashcardContext.Provider>
  )
}

export function useFlashcards() {
  const context = useContext(FlashcardContext)
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider")
  }
  return context
}

