import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("flashcards")

    const flashcardSets = await db.collection("flashcardSets").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, flashcardSets })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to retrieve flashcard sets" }, { status: 500 })
  }
}

