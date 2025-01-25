import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"
import { FlashcardProvider } from "@/contexts/FlashcardContext"
import "@/styles/globals.css"

export const fetchCache = "force-no-store"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Tutor with Flashcards",
  description: "Learn with an AI tutor and create flashcard sets",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <FlashcardProvider>{children}</FlashcardProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

