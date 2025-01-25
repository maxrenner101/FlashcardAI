"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Chat } from "@/components/chat"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const [isFlashcardExpanded, setIsFlashcardExpanded] = useState(true)

  return (
    <div className="flex h-screen">
      <div
        className={`flex flex-col ${isFlashcardExpanded ? "w-[400px]" : "w-12"} transition-all duration-300 ease-in-out bg-black`}
      >
        <Button
          onClick={() => setIsFlashcardExpanded(!isFlashcardExpanded)}
          className="self-end m-2 bg-zinc-950 hover:bg-zinc-700 text-white border-zinc-800"
          variant="outline"
          size="icon"
        >
          {isFlashcardExpanded ? <ChevronLeft className="text-white" /> : <ChevronRight className="text-white" />}
        </Button>
        {isFlashcardExpanded && <Sidebar />}
      </div>
      <main
        className={`flex-1 overflow-hidden ${isFlashcardExpanded ? "w-[calc(100%-400px)]" : "w-full"} transition-all duration-300 ease-in-out`}
      >
        <Chat />
      </main>
    </div>
  )
}

