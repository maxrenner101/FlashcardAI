import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("flashcards")

    const flashcardSets = await db.collection("flashcardSets").find({}).sort({ createdAt: -1 }).toArray()

    const response = NextResponse.json({ success: true, flashcardSets })
    response.headers.set("Cache-Control", "no-store, max-age=0")

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to retrieve flashcard sets" }, { status: 500 })
  }
}

