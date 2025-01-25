import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { title, cards } = await req.json()
    const client = await clientPromise
    const db = client.db("flashcards")

    const result = await db.collection("flashcardSets").insertOne({
      title,
      cards,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to add flashcard set" }, { status: 500 })
  }
}

