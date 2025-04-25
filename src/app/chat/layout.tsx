import type React from "react"
import { ClearChatButton } from "@/app/components/chat/clear-button"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-teal-500 text-white px-4 py-3 shadow-md">
        <div className="container max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold sm:text-xl">
              Debt Collection Assistant
            </h1>
          </div>
          <div className="flex items-center">
            <ClearChatButton />
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col overflow-hidden container max-w-3xl mx-auto px-4">
        {children}
      </div>
    </div>
  )
}