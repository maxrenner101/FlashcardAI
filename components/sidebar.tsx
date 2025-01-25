"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Flashcard } from "@/components/flashcard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useFlashcards, type FlashcardSet } from "@/contexts/FlashcardContext"

export function Sidebar() {
  const { flashcardSets, selectedSet, setSelectedSet, isLoading } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const handleSetClick = (set: FlashcardSet) => {
    setSelectedSet(set)
    setCurrentCardIndex(0)
  }

  const handleBackClick = () => {
    setSelectedSet(null)
    setCurrentCardIndex(0)
  }

  const handleNextCard = () => {
    if (selectedSet && currentCardIndex < selectedSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white p-4 flex items-center justify-center h-full">
        <p>Loading flashcard sets...</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white p-4 flex flex-col h-full">
      {selectedSet ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleBackClick} variant="ghost" size="sm" className="text-white hover:bg-zinc-800">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-xl font-bold">{selectedSet.title}</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center mb-4">
            {selectedSet.cards.length > 0 && (
              <Flashcard
                front={selectedSet.cards[currentCardIndex].front}
                back={selectedSet.cards[currentCardIndex].back}
              />
            )}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="bg-zinc-900 hover:bg-zinc-700 text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNextCard}
              disabled={currentCardIndex === selectedSet.cards.length - 1}
              className="bg-zinc-900 hover:bg-zinc-700 text-white"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Flashcard Sets</h2>
          <ScrollArea className="flex-1">
            {flashcardSets.map((set, index) => (
              <Button
                key={index}
                onClick={() => handleSetClick(set)}
                className="w-full justify-start mb-2 text-left bg-zinc-900 hover:bg-zinc-700"
                variant="ghost"
              >
                {set.title}
              </Button>
            ))}
          </ScrollArea>
        </>
      )}
    </div>
  )
}

