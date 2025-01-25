import { streamText, tool, type Message } from "ai"
import { anthropic } from "@/lib/anthropic"
import { z } from "zod"
import { StreamData } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const data = new StreamData()

  const anthropicMessages = messages.map((message: Message) => ({
    role: message.role,
    content: message.content,
  }))

  const createFlashcardSetTool = tool({
    description: "Creates a flashcard set with a title and cards containing front and back text.",
    parameters: z.object({
      title: z.string(),
      cards: z.array(
        z.object({
          front: z.string(),
          back: z.string(),
        }),
      ),
    }),
    execute: async ({ title, cards }) => {
      const response = await fetch("/api/flashcards/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, cards }),
      })

      const result = await response.json()

      if (result.success) {
        data.append({
          type: "flashcardSet",
          data: { title, cards },
        })
        return `Created flashcard set: ${title} with ${cards.length} cards.`
      } else {
        return `Failed to create flashcard set: ${result.error}`
      }
    },
  })

  const tools = {
    create_flashcard_set: createFlashcardSetTool,
  }

  const response = streamText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages: anthropicMessages,
    tools: tools,
  })

  return response.toDataStreamResponse({ data })
}

