import { streamText, tool, type Message } from "ai";
import { anthropic } from "@/lib/anthropic";
import { z } from "zod";
import { StreamData } from "ai";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { messages, selectedSet } = await req.json();
  const data = new StreamData();

  const anthropicMessages = messages.map((message: Message) => ({
    role: message.role,
    content: message.content,
  }));

  const createFlashcardSetTool = tool({
    description: "Creates a flashcard set with a title and cards containing front and back text.",
    parameters: z.object({
      title: z.string().describe("The title of the flashcard set."),
      cards: z.array(
        z.object({
          front: z.string().describe("The text displayed on the front of the card."),
          back: z.string().describe("The text displayed on the back of the card."),
        })
      ).describe("An array of cards, each with a front and back text."),
    }),
    execute: async ({ title, cards }) => {
      const response = await fetch("/api/flashcards/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, cards }),
      });

      const result = await response.json();

      if (result.success) {
        data.append({
          type: "flashcardSet",
          data: { title, cards },
        });
        return `Created flashcard set: ${title} with ${cards.length} cards.`;
      } else {
        return `Failed to create flashcard set: ${result.error}`;
      }
    },
  });

  const tools = {
    create_flashcard_set: createFlashcardSetTool,
  };

  if (selectedSet) {
    try {
      const client = await clientPromise;
      const db = client.db("flashcards");

      const flashcardSets = await db
        .collection("flashcardSets")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      const flashcardSet = flashcardSets.find((set) => set._id.toString() === selectedSet);

      if (flashcardSet) {
        const flashcardDetails = `
        The user has selected a flashcard set titled "${flashcardSet.title}" containing ${flashcardSet.cards.length} cards.
        Here are the cards:
        ${flashcardSet.cards
          .map(
            (card, index) =>
              `Card ${index + 1}:\nFront: ${card.front}\nBack: ${card.back}`
          )
          .join("\n")}

        Your task:
        1. Answer any questions about the flashcard set based on the provided information.
        2. Proactively suggest questions and answers related to the flashcard set to help the user learn more effectively.
        3. Engage with the user in a conversational and educational manner.
        `;

        anthropicMessages.unshift({
          role: "system",
          content: flashcardDetails,
        });
      } else {
        anthropicMessages.push({
          role: "system",
          content: "The selected flashcard set could not be found in the database.",
        });
      }
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      anthropicMessages.push({
        role: "system",
        content: "An error occurred while retrieving the flashcard set details.",
      });
    }
  } else {
    anthropicMessages.push({
      role: "system",
      content: "No flashcard set is currently selected. Please select a set before asking questions.",
    });
  }

  const response = streamText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages: anthropicMessages,
    tools: tools,
  });

  return response.toDataStreamResponse({ data });
}
