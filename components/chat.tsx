"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot } from "lucide-react"
import { FlashcardSet, useFlashcards } from "@/contexts/FlashcardContext"
import { useEffect } from "react"

export function Chat() {
  const { addFlashcardSet, selectedSet } = useFlashcards()
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    body: { selectedSet: selectedSet?._id },
    onToolCall: (toolCall) => {
      if(toolCall.toolCall.toolName === "create_flashcard_set") {
        addFlashcardSet(toolCall.toolCall.args as FlashcardSet);
      }
    },
  })

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-600" : "bg-zinc-700"
              }`}
            >
              <div className="flex items-start">
                {message.role === "user" ? (
                  <User className="w-5 h-5 mr-2 mt-1" />
                ) : (
                  <Bot className="w-5 h-5 mr-2 mt-1" />
                )}
                <div>
                  <p className="font-semibold mb-1">{message.role === "user" ? "You" : "AI Tutor"}</p>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-700">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the AI Tutor a question..."
            className="flex-1 mr-2 bg-zinc-800 border-zinc-700 text-white"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

